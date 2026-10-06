# В хэсэг: газрын төрлүүдэд (destination, heritagePlace, province) баримт бичгийн 7-р
# хэсгийн Destination/Place ESG block-уудад зориулсан ЗААВАЛ БИШ талбарууд нэмнэ.
#
# Дахин ажиллуулж болно: зөвхөн байхгүй талбарыг нэмнэ. Байгаа талбар, entry-д хүрэхгүй
# (entry-үүд дахин нийтлэгдэхгүй, утга бичигдэхгүй).
# Ажиллуулах: powershell -ExecutionPolicy Bypass -File scripts\contentful\04-esg-fields.ps1 [-DryRun]

param([switch]$DryRun)

. "$PSScriptRoot\_common.ps1"

function PlaceFields([bool]$withProvince) {
  $list = @()
  if ($withProvince) {
    $list += (New-Field -Id province -Name 'Аймаг' -Type Symbol -Help 'Газар байрлах аймаг, жишээ: Архангай. Ижил аймгийн туршлага, үйлчилгээг автоматаар санал болгоход ашиглагдана.')
  }
  $list += (New-Field -Id heritageFeatures -Name 'Өв, байгалийн онцлог' -Type Text -Help 'Газрын өв соёл, байгалийн онцлог: юугаараа үнэ цэнтэй, юуг хамгаалах ёстой вэ. Эх сурвалжтай мэдээлэл бичнэ.')
  $list += (New-Field -Id localPeople -Name 'Нутгийн хүмүүс' -Type Text -Help 'Энэ нутагт амьдардаг хүмүүс, өв тээгчид, тэдний амьдрал. Хүний нэрийг зөвшөөрөлтэй бол л бичнэ.')
  $list += (New-Field -Id relatedExperience -Name 'Холбоотой туршлага' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('communityExperience') -Help 'Энэ газарт хийж болох нутгийн туршлага. Хоосон бол ижил аймгийн туршлагууд автоматаар гарна.')
  $list += (New-Field -Id relatedProvider -Name 'Нутгийн үйлчилгээ (байр, хоол, хөтөч)' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('localProvider') -Help 'Энэ газарт хонох, идэх, хөтөч авах нутгийн үйлчилгээ үзүүлэгчид. Хоосон бол ижил аймгийнхан автоматаар гарна.')
  $list += (New-Field -Id relatedProduct -Name 'Нутгийн бүтээгдэхүүн' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('localProduct') -Help 'Энэ нутгаас худалдаж авч болох бүтээгдэхүүн.')
  return $list
}

$targets = @(
  @{ id = 'destination';   fields = (PlaceFields $true) },
  @{ id = 'heritagePlace'; fields = (PlaceFields $true) },
  # Аймгийн нэр нь өөрөө title талбарт байгаа тул province талбар нэмэхгүй
  @{ id = 'province';      fields = (PlaceFields $false) }
)

foreach ($t in $targets) {
  $ct = Invoke-Cma -Path "/content_types/$($t.id)"
  if ($null -eq $ct) { Write-Host "[$($t.id)] төрөл олдсонгүй, алгасав"; continue }
  $have = @($ct.fields | ForEach-Object { $_.id })
  $missing = @($t.fields | Where-Object { $have -notcontains $_.Field.id })
  if ($missing.Count -eq 0) { Write-Host "[$($t.id)] дутуу талбаргүй"; continue }
  Write-Host "[$($t.id)] нэмэх талбар: $(($missing | ForEach-Object { $_.Field.id }) -join ', ')"
  if ($DryRun) { continue }

  $body = [ordered]@{
    name = $ct.name; description = $ct.description; displayField = $ct.displayField
    fields = @($ct.fields) + @($missing | ForEach-Object { [pscustomobject]$_.Field })
  }
  $ct = Invoke-Cma -Method PUT -Path "/content_types/$($t.id)" -Body $body -Version $ct.sys.version
  $ct = Invoke-Cma -Method PUT -Path "/content_types/$($t.id)/published" -Version $ct.sys.version

  # Шинэ талбаруудын монгол тайлбар
  $ei = Invoke-Cma -Path "/content_types/$($t.id)/editor_interface"
  $ids = @($missing | ForEach-Object { $_.Field.id })
  $controls = @($ei.controls | Where-Object { $ids -notcontains $_.fieldId })
  foreach ($f in $missing) {
    $controls += [pscustomobject]@{ fieldId = $f.Field.id; widgetId = $f.Widget; widgetNamespace = 'builtin'; settings = @{ helpText = $f.Help } }
  }
  Invoke-Cma -Method PUT -Path "/content_types/$($t.id)/editor_interface" -Body @{ controls = $controls } -Version $ei.sys.version | Out-Null
  Write-Host "[$($t.id)] нэмсэн"
}
Write-Host 'Дууслаа.'
