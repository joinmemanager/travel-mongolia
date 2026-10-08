# Contentful Management API-ийн нийтлэг туслах функцууд.
# Бусад скрипт энэ файлыг ". $PSScriptRoot\_common.ps1" гэж дуудна.
#
# Token-ийг travel-mongolia/.env.local-аас уншина (CONTENTFUL_MANAGEMENT_TOKEN,
# CONTENTFUL_SPACE_ID). Token хэзээ ч дэлгэцэнд хэвлэгдэхгүй, commit хийгдэхгүй.

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$script:Locale = 'mn'   # Контентын үндсэн locale (монгол текст энэ locale-д хадгалагддаг)
$script:EnvId = 'master'

function Import-ContentfulEnv {
  $envFile = Join-Path $PSScriptRoot '..\..\travel-mongolia\.env.local'
  if (-not (Test-Path $envFile)) { throw ".env.local олдсонгүй: $envFile" }
  foreach ($line in Get-Content $envFile -Encoding UTF8) {
    if ($line -match '^\s*([A-Z_]+)\s*=\s*(.*)\s*$') {
      Set-Variable -Scope Script -Name ("env_" + $Matches[1]) -Value $Matches[2].Trim('"')
    }
  }
  if (-not $script:env_CONTENTFUL_MANAGEMENT_TOKEN) { throw '.env.local-д CONTENTFUL_MANAGEMENT_TOKEN алга' }
  if (-not $script:env_CONTENTFUL_SPACE_ID) { throw '.env.local-д CONTENTFUL_SPACE_ID алга' }
  $script:BaseUrl = "https://api.contentful.com/spaces/$($script:env_CONTENTFUL_SPACE_ID)/environments/$($script:EnvId)"
}

# CMA хүсэлт. 404 бол $null буцаана. Алдааны мэдээнд token орохгүй.
function Invoke-Cma {
  param(
    [string]$Method = 'GET',
    [string]$Path,
    $Body = $null,
    [int]$Version = 0,
    [string]$ContentType = ''
  )
  $headers = @{ Authorization = "Bearer $($script:env_CONTENTFUL_MANAGEMENT_TOKEN)" }
  if ($Version -gt 0) { $headers['X-Contentful-Version'] = "$Version" }
  if ($ContentType) { $headers['X-Contentful-Content-Type'] = $ContentType }
  $params = @{ Method = $Method; Uri = "$($script:BaseUrl)$Path"; Headers = $headers }
  if ($null -ne $Body) {
    $json = $Body | ConvertTo-Json -Depth 30 -Compress
    $params['Body'] = [System.Text.Encoding]::UTF8.GetBytes($json)
    $params['ContentType'] = 'application/vnd.contentful.management.v1+json'
  }
  for ($attempt = 1; $attempt -le 5; $attempt++) {
    try {
      $resp = Invoke-WebRequest @params -UseBasicParsing
      $text = [System.Text.Encoding]::UTF8.GetString($resp.RawContentStream.ToArray())
      if (-not $text) { return $null }
      return $text | ConvertFrom-Json
    } catch {
      $status = 0
      if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
      if ($status -eq 404 -and $Method -eq 'GET') { return $null }
      if ($status -eq 429 -and $attempt -lt 5) { Start-Sleep -Seconds (2 * $attempt); continue }
      $detail = ''
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $detail = $reader.ReadToEnd()
      } catch {}
      throw "Contentful $Method $Path алдаа ($status): $detail"
    }
  }
}

# ------------------------------------------------------------- талбарын тодорхойлолт
# New-Field -Id title -Name 'Гарчиг' -Type Symbol -Required -Help '...'
function New-Field {
  param(
    [string]$Id, [string]$Name, [string]$Type,
    [switch]$Required,
    [string]$LinkType = '',          # Link төрөлд: Entry / Asset
    [string]$ItemsType = '',         # Array төрөлд: Symbol / Link
    [string]$ItemsLinkType = '',     # Array<Link>-д: Entry / Asset
    [string[]]$In = @(),             # Зөвшөөрөгдөх утгууд
    [string[]]$LinkContentTypes = @(),
    [switch]$Unique,
    [string]$Regexp = '',
    [string]$Widget = '',
    [string]$Help = ''
  )
  $field = [ordered]@{
    id = $Id; name = $Name; type = $Type; localized = $false
    required = [bool]$Required; disabled = $false; omitted = $false
    validations = @()
  }
  $validations = @()
  if ($In.Count -gt 0) { $validations += @{ in = $In } }
  if ($Unique) { $validations += @{ unique = $true } }
  if ($Regexp) { $validations += @{ regexp = @{ pattern = $Regexp } } }
  if ($Type -eq 'Link') {
    $field['linkType'] = $LinkType
    if ($LinkContentTypes.Count -gt 0) { $validations += @{ linkContentType = $LinkContentTypes } }
    if ($LinkType -eq 'Asset') { $validations += @{ linkMimetypeGroup = @('image') } }
  }
  $field['validations'] = $validations
  if ($Type -eq 'Array') {
    $items = [ordered]@{ type = $ItemsType; validations = @() }
    if ($ItemsType -eq 'Link') {
      $items['linkType'] = $ItemsLinkType
      if ($LinkContentTypes.Count -gt 0) { $items['validations'] = @(@{ linkContentType = $LinkContentTypes }) }
      if ($ItemsLinkType -eq 'Asset') { $items['validations'] = @(@{ linkMimetypeGroup = @('image') }) }
    }
    $field['items'] = $items
  }
  if (-not $Widget) {
    $Widget = switch ($Type) {
      'Symbol'   { if ($In.Count -gt 0) { 'dropdown' } elseif ($Id -eq 'slug') { 'slugEditor' } else { 'singleLine' } }
      'Text'     { 'multipleLine' }
      'RichText' { 'richTextEditor' }
      'Boolean'  { 'boolean' }
      'Date'     { 'datePicker' }
      'Location' { 'locationEditor' }
      'Integer'  { 'numberEditor' }
      'Link'     { if ($LinkType -eq 'Asset') { 'assetLinkEditor' } else { 'entryLinkEditor' } }
      'Array'    {
        if ($ItemsType -eq 'Symbol') { 'tagEditor' }
        elseif ($ItemsLinkType -eq 'Asset') { 'assetLinksEditor' }
        else { 'entryLinksEditor' }
      }
    }
  }
  return [pscustomobject]@{ Field = $field; Widget = $Widget; Help = $Help }
}

# Slug-ийн дүрэм: латин жижиг үсэг, тоо, зураас (жишээ: ulsyn-ikh-bayar-naadam)
$script:SlugPattern = '^[a-z0-9]+(?:-[a-z0-9]+)*$'

# Монгол кирилл бичгийг латинаар бичих (MNS 5217-д ойролцоо, хаягт ойлгомжтой хувилбар)
function ConvertTo-Slug {
  param([string]$Text)
  $map = @{
    'а'='a';'б'='b';'в'='v';'г'='g';'д'='d';'е'='ye';'ё'='yo';'ж'='j';'з'='z';'и'='i';'й'='i'
    'к'='k';'л'='l';'м'='m';'н'='n';'о'='o';'ө'='u';'п'='p';'р'='r';'с'='s';'т'='t';'у'='u'
    'ү'='u';'ф'='f';'х'='kh';'ц'='ts';'ч'='ch';'ш'='sh';'щ'='sh';'ъ'='';'ы'='y';'ь'='';'э'='e'
    'ю'='yu';'я'='ya'
  }
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in $Text.ToLowerInvariant().ToCharArray()) {
    $s = [string]$ch
    if ($map.ContainsKey($s)) { [void]$sb.Append($map[$s]) }
    elseif ($s -match '[a-z0-9]') { [void]$sb.Append($s) }
    else { [void]$sb.Append('-') }
  }
  $slug = ($sb.ToString() -replace '-+', '-').Trim('-')
  return $slug
}

# Entry-ийн талбарын утгыг үндсэн locale-оос уншина
function Get-FieldValue($entry, [string]$fieldId) {
  $f = $entry.fields.$fieldId
  if ($null -eq $f) { return $null }
  return $f.$($script:Locale)
}

# Entry өмнө нь нийтлэгдсэн бөгөөд хадгалаагүй өөрчлөлтгүй эсэх
# (тийм бол бидний өөрчлөлтийн дараа дахин publish хийхэд өөр хүний ноорог нийтлэгдэхгүй)
function Test-CleanPublished($entry) {
  $pv = $entry.sys.publishedVersion
  return ($null -ne $pv) -and ($entry.sys.version -eq ($pv + 1))
}

Import-ContentfulEnv
