# Destination загварыг docs/SEO_Technical_Brief.md-ийн 14-р хэсэгтэй нийцүүлэх (2026-10-08).
# 05-i18n-seo.ps1-ийн дараа ажиллуулна. destination, province төрөлд нэмнэ:
#   intro (100–150 үгийн танилцуулга)   -> whyVisit-ийн өмнө
#   suggestedItineraries (маршрут)      -> whereToStay-ийн дараа
#   sources, reviewedBy, lastUpdated    -> төгсгөлд
# Дахин ажиллуулж болно. Entry-д хүрэхгүй.
# Ажиллуулах: powershell -ExecutionPolicy Bypass -File scripts\contentful\06-destination-template.ps1 [-DryRun]

param([switch]$DryRun)

. "$PSScriptRoot\_common.ps1"

$intro = New-Field -Id intro -Name 'Товч танилцуулга' -Type Text -Help '100–150 үг. Газар юугаараа онцлог, хэнд тохирох, хаана байрладгийг товч бичнэ. Хуудасны эхэнд харагдана.'
$itineraries = New-Field -Id suggestedItineraries -Name 'Санал болгох маршрут' -Type RichText -Help 'Энэ газрыг багтаасан 1–3 маршрут: хоног бүрээр товч (Өдөр 1: Улаанбаатар – ...).'
$sources = New-Field -Id sources -Name 'Эх сурвалж' -Type RichText -Help 'Мэдээллийн эх сурвалж: байгууллага, ном, вэб хуудас (холбоостой).'
$reviewedBy = New-Field -Id reviewedBy -Name 'Хянасан (нутгийн мэргэжилтэн)' -Type Symbol -Help 'Агуулгыг хянасан хүний нэр, албан тушаал. Жишээ: Б. Бат, Хөвсгөл аймгийн аялал жуулчлалын хөтөч.'
$lastUpdated = New-Field -Id lastUpdated -Name 'Сүүлд шинэчилсэн' -Type Date -Help 'Агуулгыг бодитоор шалгаж шинэчилсэн огноо. Хуудсан дээр "Сүүлд шинэчилсэн" гэж харагдана.'
foreach ($f in @($intro, $itineraries, $sources)) { $f.Field.localized = $true }

# [талбар, аль талбарын дараа (хоосон бол төгсгөлд)]
$plan = @(
  @($intro, 'BEFORE:whyVisit'),
  @($itineraries, 'whereToStay'),
  @($sources, ''),
  @($reviewedBy, ''),
  @($lastUpdated, '')
)

foreach ($id in @('destination', 'province')) {
  $ct = Invoke-Cma -Path "/content_types/$id"
  if ($null -eq $ct) { Write-Host "[$id] олдсонгүй"; continue }
  $fields = [System.Collections.ArrayList]@($ct.fields)
  $added = @()
  foreach ($p in $plan) {
    $f = $p[0]; $anchor = $p[1]
    if (@($fields | ForEach-Object { $_.id }) -contains $f.Field.id) { continue }
    $obj = [pscustomobject]$f.Field
    $ids = @($fields | ForEach-Object { $_.id })
    if ($anchor -like 'BEFORE:*') { $i = [array]::IndexOf($ids, $anchor.Substring(7)) }
    elseif ($anchor) { $i = [array]::IndexOf($ids, $anchor); if ($i -ge 0) { $i++ } }
    else { $i = -1 }
    if ($i -lt 0) { [void]$fields.Add($obj) } else { $fields.Insert($i, $obj) }
    $added += $f
  }
  if ($added.Count -eq 0) { Write-Host "[$id] өөрчлөлтгүй"; continue }
  Write-Host "[$id] нэмэх талбар: $(($added | ForEach-Object { $_.Field.id }) -join ', ')"
  if ($DryRun) { continue }

  $body = [ordered]@{ name = $ct.name; description = $ct.description; displayField = $ct.displayField; fields = @($fields) }
  $ct = Invoke-Cma -Method PUT -Path "/content_types/$id" -Body $body -Version $ct.sys.version
  $ct = Invoke-Cma -Method PUT -Path "/content_types/$id/published" -Version $ct.sys.version
  $ei = Invoke-Cma -Path "/content_types/$id/editor_interface"
  $newIds = @($added | ForEach-Object { $_.Field.id })
  $controls = @($ei.controls | Where-Object { $newIds -notcontains $_.fieldId })
  foreach ($f in $added) {
    $controls += [pscustomobject]@{ fieldId = $f.Field.id; widgetId = $f.Widget; widgetNamespace = 'builtin'; settings = @{ helpText = $f.Help } }
  }
  Invoke-Cma -Method PUT -Path "/content_types/$id/editor_interface" -Body @{ controls = $controls } -Version $ei.sys.version | Out-Null
}
Write-Host 'Дууслаа.'
