# destination, heritagePlace, recommendation төрөлд slug талбар нэмж, одоо байгаа
# entry-д латин slug бөглөнө. Дахин ажиллуулж болно: slug-тай entry-д хүрэхгүй.
#
# Нийтлэгдсэн, хадгалаагүй өөрчлөлтгүй entry-г slug нэмсний дараа дахин нийтэлнэ.
# Ноорог өөрчлөлттэй entry-г нийтлэхгүй (өөр хүний ноорог нийтлэгдэхээс сэргийлнэ),
# жагсаалтад "гараар нийтлэх" гэж гаргана.
#
# Ажиллуулах: powershell -ExecutionPolicy Bypass -File scripts\contentful\02-slugs.ps1 [-DryRun]
# -DryRun: юу хийхийг л хэвлэнэ.

param([switch]$DryRun)

. "$PSScriptRoot\_common.ps1"

# Төрөл бүрийн slug үүсгэх эх талбар
$targets = @(
  @{ id = 'destination';   from = 'title' },
  @{ id = 'heritagePlace'; from = 'name' },
  @{ id = 'recommendation'; from = 'title' }
)

# Автомат галиглал таарахгүй бол энд гараар заана: entry ID => slug
$overrides = @{
}

$slugField = (New-Field -Id slug -Name 'Slug' -Type Symbol -Unique -Regexp $script:SlugPattern `
  -Help 'Хаягт харагдах нэр. Зөвхөн латин жижиг үсэг, тоо, зураас. Нийтэлсний дараа өөрчилбөл хуучин хаяг шинэ рүү шилждэг (redirect) тул болгоомжтой өөрчилнө.')

foreach ($t in $targets) {
  $ct = Invoke-Cma -Path "/content_types/$($t.id)"
  if ($null -eq $ct) { Write-Host "[$($t.id)] төрөл олдсонгүй, алгасав"; continue }

  # 1. slug талбар
  if (@($ct.fields | ForEach-Object { $_.id }) -notcontains 'slug') {
    Write-Host "[$($t.id)] slug талбар нэмнэ"
    if (-not $DryRun) {
      $body = [ordered]@{
        name = $ct.name; description = $ct.description; displayField = $ct.displayField
        fields = @($ct.fields) + @([pscustomobject]$slugField.Field)
      }
      $ct = Invoke-Cma -Method PUT -Path "/content_types/$($t.id)" -Body $body -Version $ct.sys.version
      $ct = Invoke-Cma -Method PUT -Path "/content_types/$($t.id)/published" -Version $ct.sys.version
      $ei = Invoke-Cma -Path "/content_types/$($t.id)/editor_interface"
      $controls = @($ei.controls | Where-Object { $_.fieldId -ne 'slug' }) + @([pscustomobject]@{
        fieldId = 'slug'; widgetId = 'slugEditor'; widgetNamespace = 'builtin'; settings = @{ helpText = $slugField.Help }
      })
      Invoke-Cma -Method PUT -Path "/content_types/$($t.id)/editor_interface" -Body @{ controls = $controls } -Version $ei.sys.version | Out-Null
    }
  } else {
    Write-Host "[$($t.id)] slug талбар байгаа"
  }

  # 2. Entry бүрийн slug
  $entries = Invoke-Cma -Path "/entries?content_type=$($t.id)&limit=1000"
  if ($null -eq $entries) { continue }
  $used = @{}
  foreach ($e in $entries.items) {
    $s = Get-FieldValue $e 'slug'
    if ($s) { $used[$s] = $e.sys.id }
  }
  foreach ($e in $entries.items) {
    if (Get-FieldValue $e 'slug') { continue }
    $title = [string](Get-FieldValue $e $t.from)
    $slug = if ($overrides.ContainsKey($e.sys.id)) { $overrides[$e.sys.id] } else { ConvertTo-Slug $title }
    if (-not $slug) { Write-Host "  $($e.sys.id): гарчиггүй, алгасав"; continue }
    $base = $slug; $n = 2
    while ($used.ContainsKey($slug)) { $slug = "$base-$n"; $n++ }
    $used[$slug] = $e.sys.id

    $clean = Test-CleanPublished $e
    $action = if ($clean) { 'нийтэлнэ' } elseif ($null -eq $e.sys.publishedVersion) { 'ноорог хэвээр' } else { 'гараар нийтлэх (ноорог өөрчлөлттэй)' }
    Write-Host "  $($e.sys.id): $title -> $slug ($action)"
    if ($DryRun) { continue }

    if (-not $e.fields.PSObject.Properties['slug']) {
      $e.fields | Add-Member -NotePropertyName slug -NotePropertyValue ([pscustomobject]@{})
    }
    $e.fields.slug | Add-Member -NotePropertyName $script:Locale -NotePropertyValue $slug -Force
    $updated = Invoke-Cma -Method PUT -Path "/entries/$($e.sys.id)" -Body @{ fields = $e.fields } -Version $e.sys.version
    if ($clean) {
      Invoke-Cma -Method PUT -Path "/entries/$($e.sys.id)/published" -Version $updated.sys.version | Out-Null
    }
  }
}
Write-Host 'Дууслаа.'
