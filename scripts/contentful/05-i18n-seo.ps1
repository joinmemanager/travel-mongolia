# Олон хэл, SEO, Destination загварын бэлтгэл (2026-10-08).
#
# 1. Locale: үндсэн locale-ийн кодыг en-US -> mn (нэр "Монгол") болгоно. Одоо байгаа монгол
#    контент энэ locale-д хадгалагдсан тул өгөгдөл хөдлөхгүй, үндсэн хэл хэвээр.
#    Хоосон zh-CN-ийг "en" (English, fallback: mn) болгоно (тарифын 2 locale-ийн хязгаар).
# 2. Текстэн талбаруудыг localized болгоно (зураг, огноо, холбоос, координат, slug, URL,
#    сонголтот утга, аймгийн нэр биш). Одоо байгаа утгууд mn locale-д хэвээр үлдэнэ.
# 3. Хуудастай бүх төрөлд seoTitle, seoDescription, ogImage (заавал биш).
# 4. faqItem төрөл (асуулт, хариулт); destination, province-д Destination загварын талбарууд.
#
# Дахин ажиллуулж болно. Entry-д хүрэхгүй (утга бичихгүй, дахин нийтлэхгүй).
# Ажиллуулах: powershell -ExecutionPolicy Bypass -File scripts\contentful\05-i18n-seo.ps1 [-DryRun]

param([switch]$DryRun)

. "$PSScriptRoot\_common.ps1"

$BaseCode = 'mn'

# ------------------------------------------------------------------ 1. Locale
function Sync-Locales {
  $locales = (Invoke-Cma -Path '/locales').items
  $default = $locales | Where-Object { $_.default } | Select-Object -First 1
  if ($default.code -ne $BaseCode) {
    Write-Host "[locale] үндсэн locale: $($default.code) ($($default.name)) -> $BaseCode (Монгол), үндсэн хэвээр"
    if (-not $DryRun) {
      $body = @{ name = 'Монгол'; code = $BaseCode; fallbackCode = $null; contentDeliveryApi = $true; contentManagementApi = $true; optional = $false }
      Invoke-Cma -Method PUT -Path "/locales/$($default.sys.id)" -Body $body -Version $default.sys.version | Out-Null
    }
  } else { Write-Host "[locale] үндсэн locale аль хэдийн $BaseCode" }

  # Тарифт 2 locale л зөвшөөрөгддөг (POST /locales -> 403). Хоосон zh-CN-ийг en болгож нэрлэнэ;
  # хятад хэлийг тариф ахиулсны дараа дахин нэмнэ.
  $enBody = @{ name = 'English'; code = 'en'; fallbackCode = $BaseCode; contentDeliveryApi = $true; contentManagementApi = $true; optional = $true }
  $zh = $locales | Where-Object { $_.code -eq 'zh-CN' }
  if ($locales | Where-Object { $_.code -eq 'en' }) { Write-Host "[locale] en байгаа" }
  elseif ($zh) {
    Write-Host "[locale] zh-CN (хоосон) -> en (English), fallback: $BaseCode"
    if (-not $DryRun) { Invoke-Cma -Method PUT -Path "/locales/$($zh.sys.id)" -Body $enBody -Version $zh.sys.version | Out-Null }
  } else {
    Write-Host "[locale] нэмнэ: en (English), fallback: $BaseCode"
    if (-not $DryRun) { Invoke-Cma -Method POST -Path '/locales' -Body $enBody | Out-Null }
  }
  $locales = (Invoke-Cma -Path '/locales').items

  foreach ($l in $locales | Where-Object { -not $_.default -and $_.code -ne 'en' }) {
    if ($l.fallbackCode -ne $BaseCode) {
      Write-Host "[locale] $($l.code) ($($l.name)): fallback $($l.fallbackCode) -> $BaseCode"
      if (-not $DryRun) {
        $body = @{ name = $l.name; code = $l.code; fallbackCode = $BaseCode; contentDeliveryApi = $l.contentDeliveryApi; contentManagementApi = $l.contentManagementApi; optional = $true }
        Invoke-Cma -Method PUT -Path "/locales/$($l.sys.id)" -Body $body -Version $l.sys.version | Out-Null
      }
    }
  }
}

# ------------------------------------------------------------------ 2. Localized болгох дүрэм
# Орчуулагдахгүй талбарууд: хаяг, URL, сонголтот утга, логикт ашиглагддаг аймгийн нэр, холбоо барих
$NotTranslated = @('slug', 'bookingUrl', 'videoUrl', 'linkUrl', 'contact', 'province', 'providerType', 'topic', 'language', 'temperature', 'weather')

function Should-Localize($f) {
  if ($NotTranslated -contains $f.id) { return $false }
  $isText = @('Symbol', 'Text', 'RichText') -contains $f.type -or ($f.type -eq 'Array' -and $f.items.type -eq 'Symbol')
  if (-not $isText) { return $false }
  # Сонголтот утга (in) эсвэл URL хэлбэрийн шалгалттай талбар орчуулагдахгүй
  foreach ($v in @($f.validations) + @($f.items.validations)) {
    if ($null -eq $v) { continue }
    if ($v.PSObject.Properties['in']) { return $false }
    if ($v.PSObject.Properties['regexp'] -and $v.regexp.pattern -like '^https*') { return $false }
  }
  return $true
}

# ------------------------------------------------------------------ 3, 4. Шинэ талбарууд
$seoFields = @(
  (New-Field -Id seoTitle -Name 'SEO гарчиг' -Type Symbol -Help 'Google-ийн хайлтад харагдах гарчиг, 60 тэмдэгтээс ихгүй. Хоосон бол хуудасны гарчгийг автоматаар ашиглана.')
  (New-Field -Id seoDescription -Name 'SEO тайлбар' -Type Text -Help 'Google-ийн хайлтад гарчгийн доор харагдах тайлбар, 150–160 тэмдэгт. Хоосон бол агуулгын эхнээс автоматаар авна.')
  (New-Field -Id ogImage -Name 'Хуваалцах зураг (OG)' -Type Link -LinkType Asset -Help 'Facebook, мессенжерт холбоос хуваалцахад харагдах зураг, 1200×630 px. Хоосон бол нүүр зургийг ашиглана.')
)
foreach ($f in $seoFields) { if ($f.Field.id -ne 'ogImage') { $f.Field.localized = $true } }

$placeFields = @(
  (New-Field -Id whyVisit -Name 'Яагаад очих вэ' -Type RichText -Help 'Энэ газрыг заавал үзэх 2–4 шалтгаан.')
  (New-Field -Id attractions -Name 'Үзмэрүүд' -Type RichText -Help 'Гол үзэх газрууд, нэг бүрийг гарчиг + 1–2 өгүүлбэрээр.')
  (New-Field -Id thingsToDo -Name 'Юу хийх вэ' -Type RichText -Help 'Хийж болох зүйлс: явган аялал, морин аялал, загасчлал г.м.')
  (New-Field -Id bestTimeToVisit -Name 'Хэзээ очих (улирал)' -Type Text -Help 'Хамгийн тохиромжтой сар, улирал, цаг агаарын онцлог.')
  (New-Field -Id suggestedDuration -Name 'Хэдэн хоног' -Type Symbol -Help 'Санал болгох хугацаа. Жишээ: 2–3 хоног.')
  (New-Field -Id gettingThere -Name 'Хэрхэн очих' -Type RichText -Help 'Улаанбаатараас очих зам, хугацаа, тээврийн сонголт.')
  (New-Field -Id whereToStay -Name 'Хаана буудаллах' -Type RichText -Help 'Буудаллах сонголтууд: гэр бааз, малчин айл, зочид буудал.')
  (New-Field -Id faq -Name 'Асуулт-хариулт (FAQ)' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('faqItem') -Help 'Аялагчдын түгээмэл асуулт. Эхлээд "Асуулт-хариулт" entry үүсгээд энд сонгоно. Google-д FAQ хэлбэрээр харагдана.')
)
foreach ($f in $placeFields) { if ($f.Field.type -ne 'Array') { $f.Field.localized = $true } }

$faqType = @{
  id = 'faqItem'; name = 'Асуулт-хариулт (FAQ)'; displayField = 'question'
  description = 'Газрын хуудасны асуулт-хариулт (destination, province-ийн faq талбар).'
  fields = @(
    (New-Field -Id question -Name 'Асуулт' -Type Symbol -Required -Help 'Аялагчийн асуулт. Жишээ: Хөвсгөл нуур руу хэрхэн очих вэ?')
    (New-Field -Id answer -Name 'Хариулт' -Type Text -Required -Help '2–4 өгүүлбэр, тодорхой хариулт.')
  )
}
foreach ($f in $faqType.fields) { $f.Field.localized = $true }

# SEO талбар нэмэх төрлүүд: өөрийн хуудастай бүх төрөл
$seoTypes = @('destination', 'heritagePlace', 'heritageCategory', 'province', 'recommendation', 'localProvider', 'communityExperience', 'event', 'story', 'localProduct')

# ------------------------------------------------------------------ гүйцэтгэл
function Update-ContentType([string]$id, $addFields) {
  $ct = Invoke-Cma -Path "/content_types/$id"
  if ($null -eq $ct) { Write-Host "[$id] олдсонгүй"; return }
  $have = @($ct.fields | ForEach-Object { $_.id })
  $toLocalize = @($ct.fields | Where-Object { -not $_.localized -and (Should-Localize $_) } | ForEach-Object { $_.id })
  $missing = @($addFields | Where-Object { $have -notcontains $_.Field.id })
  if ($toLocalize.Count -eq 0 -and $missing.Count -eq 0) { Write-Host "[$id] өөрчлөлтгүй"; return }
  if ($toLocalize.Count -gt 0) { Write-Host "[$id] localized болгох: $($toLocalize -join ', ')" }
  if ($missing.Count -gt 0) { Write-Host "[$id] нэмэх талбар: $(($missing | ForEach-Object { $_.Field.id }) -join ', ')" }
  if ($DryRun) { return }

  foreach ($f in $ct.fields) { if ($toLocalize -contains $f.id) { $f.localized = $true } }
  $body = [ordered]@{
    name = $ct.name; description = $ct.description; displayField = $ct.displayField
    fields = @($ct.fields) + @($missing | ForEach-Object { [pscustomobject]$_.Field })
  }
  $ct = Invoke-Cma -Method PUT -Path "/content_types/$id" -Body $body -Version $ct.sys.version
  $ct = Invoke-Cma -Method PUT -Path "/content_types/$id/published" -Version $ct.sys.version
  if ($missing.Count -gt 0) {
    $ei = Invoke-Cma -Path "/content_types/$id/editor_interface"
    $ids = @($missing | ForEach-Object { $_.Field.id })
    $controls = @($ei.controls | Where-Object { $ids -notcontains $_.fieldId })
    foreach ($f in $missing) {
      $controls += [pscustomobject]@{ fieldId = $f.Field.id; widgetId = $f.Widget; widgetNamespace = 'builtin'; settings = @{ helpText = $f.Help } }
    }
    Invoke-Cma -Method PUT -Path "/content_types/$id/editor_interface" -Body @{ controls = $controls } -Version $ei.sys.version | Out-Null
  }
}

Sync-Locales

# faqItem эхэлж (destination, province-ийн faq талбар түүн рүү холбогдоно)
$faqCt = Invoke-Cma -Path '/content_types/faqItem'
if ($null -eq $faqCt) {
  Write-Host "[faqItem] үүсгэнэ: question, answer (localized)"
  if (-not $DryRun) {
    $body = [ordered]@{ name = $faqType.name; description = $faqType.description; displayField = 'question'; fields = @($faqType.fields | ForEach-Object { $_.Field }) }
    $ct = Invoke-Cma -Method PUT -Path '/content_types/faqItem' -Body $body
    $ct = Invoke-Cma -Method PUT -Path '/content_types/faqItem/published' -Version $ct.sys.version
    Start-Sleep -Seconds 2
    $ei = Invoke-Cma -Path '/content_types/faqItem/editor_interface'
    $controls = @($faqType.fields | ForEach-Object { [pscustomobject]@{ fieldId = $_.Field.id; widgetId = $_.Widget; widgetNamespace = 'builtin'; settings = @{ helpText = $_.Help } } })
    Invoke-Cma -Method PUT -Path '/content_types/faqItem/editor_interface' -Body @{ controls = $controls } -Version $ei.sys.version | Out-Null
  }
} else { Write-Host "[faqItem] байгаа" }

$all = (Invoke-Cma -Path '/content_types?limit=100').items | ForEach-Object { $_.sys.id } | Where-Object { $_ -ne 'faqItem' }
foreach ($id in $all) {
  $add = @()
  if ($seoTypes -contains $id) { $add += $seoFields }
  if (@('destination', 'province') -contains $id) { $add += $placeFields }
  Update-ContentType $id $add
}
$skipped = @($all | Where-Object { $seoTypes -notcontains $_ })
if ($skipped.Count -gt 0) { Write-Host "SEO талбаргүй (өөрийн хуудасгүй) төрлүүд: $($skipped -join ', ')" }

if (-not $DryRun) {
  Write-Host 'Анхаар: scripts/contentful/_common.ps1-ийн $Locale-ийг ''mn'' болгох шаардлагатай.'
}
Write-Host 'Дууслаа.'
