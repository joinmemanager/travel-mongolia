# Contentful-ын бүрэн нөөц (CMA, бүх locale-той): locale, content type, editor interface,
# бүх entry, asset-ийн JSON. Файлууд: backups/contentful-<огноо>/ (git-д ордоггүй, .gitignore).
# Ажиллуулах: powershell -ExecutionPolicy Bypass -File scripts\contentful\00-backup.ps1 [-Name contentful-2026-10-08]

param([string]$Name = ('contentful-' + (Get-Date -Format 'yyyy-MM-dd')))

. "$PSScriptRoot\_common.ps1"

$dir = Join-Path $PSScriptRoot "..\..\backups\$Name"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

function Save-Json($obj, [string]$file) {
  $json = $obj | ConvertTo-Json -Depth 50
  [System.IO.File]::WriteAllText((Join-Path $dir $file), $json, (New-Object System.Text.UTF8Encoding($false)))
}

# Хуудаслан бүгдийг татах
function Get-All([string]$path) {
  $all = @(); $skip = 0
  do {
    $sep = if ($path.Contains('?')) { '&' } else { '?' }
    $res = Invoke-Cma -Path "$path${sep}limit=500&skip=$skip"
    $all += @($res.items); $skip += 500
  } while ($skip -lt $res.total)
  return $all
}

$locales = Get-All '/locales'
Save-Json $locales 'locales.json'
$types = Get-All '/content_types'
Save-Json $types 'content_types.json'
$interfaces = @($types | ForEach-Object { Invoke-Cma -Path "/content_types/$($_.sys.id)/editor_interface" })
Save-Json $interfaces 'editor_interfaces.json'
$entries = Get-All '/entries'
Save-Json $entries 'entries.json'
$assets = Get-All '/assets'
Save-Json $assets 'assets.json'

Write-Host "Нөөц: $dir"
Write-Host "  locale $($locales.Count), content type $($types.Count), editor interface $($interfaces.Count), entry $($entries.Count), asset $($assets.Count)"
