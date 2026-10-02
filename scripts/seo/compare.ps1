<#
.SYNOPSIS
  crawl.ps1-ийн хоёр baseline-ийг харьцуулж өөрчлөлтийг Markdown-оор гаргана.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\seo\compare.ps1 -Old docs\baseline\2026-10-02 -New docs\baseline\2026-11-01
  # -Out заавал биш. Заагаагүй бол <New>\compare-<Old огноо>.md-д бичнэ.
#>
param(
  [Parameter(Mandatory = $true)][string]$Old,
  [Parameter(Mandatory = $true)][string]$New,
  [string]$Out
)

$ErrorActionPreference = 'Stop'
$oldRows = Import-Csv (Join-Path $Old 'crawl.csv') -Encoding UTF8
$newRows = Import-Csv (Join-Path $New 'crawl.csv') -Encoding UTF8
if (-not $Out) { $Out = Join-Path $New ("compare-{0}.md" -f (Split-Path $Old -Leaf)) }

$oldBy = @{}; foreach ($r in $oldRows) { $oldBy[$r.url] = $r }
$newBy = @{}; foreach ($r in $newRows) { $newBy[$r.url] = $r }
$fields = 'status', 'redirect_to', 'title', 'meta_description', 'h1', 'canonical', 'robots', 'jsonld_types', 'in_sitemap'

function ConvertTo-MdCell([string]$s) { return ($s -replace '\|', '\|' -replace "`r?`n", ' ') }

$sb = New-Object System.Text.StringBuilder
function W([string]$line = '') { [void]$sb.AppendLine($line) }

W "# SEO baseline харьцуулалт: $(Split-Path $Old -Leaf) → $(Split-Path $New -Leaf)"
W ''
W "| | Өмнө | Одоо |"
W '|---|---|---|'
W "| Мөлхсөн URL | $($oldRows.Count) | $($newRows.Count) |"
foreach ($code in (@($oldRows + $newRows) | ForEach-Object { $_.status } | Sort-Object -Unique)) {
  $o = @($oldRows | Where-Object { $_.status -eq $code }).Count
  $n = @($newRows | Where-Object { $_.status -eq $code }).Count
  W "| Status $code | $o | $n |"
}
W ''

$added = @($newRows | Where-Object { -not $oldBy.ContainsKey($_.url) })
$removed = @($oldRows | Where-Object { -not $newBy.ContainsKey($_.url) })
W "## Шинээр гарсан URL ($($added.Count))"
W ''
foreach ($r in $added) { W "- ``$($r.url)`` ($($r.status))" }
W ''
W "## Алга болсон URL ($($removed.Count))"
W ''
foreach ($r in $removed) { W "- ``$($r.url)`` (өмнө $($r.status))" }
W ''

W '## Өөрчлөгдсөн талбарууд'
W ''
$changes = 0
W '| URL | Талбар | Өмнө | Одоо |'
W '|---|---|---|---|'
foreach ($r in $newRows) {
  if (-not $oldBy.ContainsKey($r.url)) { continue }
  $o = $oldBy[$r.url]
  foreach ($f in $fields) {
    if ("$($o.$f)" -ne "$($r.$f)") {
      W "| ``$($r.url)`` | $f | $(ConvertTo-MdCell $o.$f) | $(ConvertTo-MdCell $r.$f) |"
      $changes++
    }
  }
}
if ($changes -eq 0) { W '| _өөрчлөлт алга_ | | | |' }

[IO.File]::WriteAllText($Out, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Харьцуулалт: $Out"
