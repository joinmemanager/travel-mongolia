<#
.SYNOPSIS
  travelhubmongolia.com сайтын SEO baseline мөлхүүр.
  Node/Python шаардлагагүй, Windows PowerShell 5.1 дээр ажиллана.

.DESCRIPTION
  1. sitemap.xml-ийн бүх URL, нүүр хуудас, Navbar.tsx-ийн цэсний холбоосуудаас эхэлж
     сайтын доторх бүх холбоосыг мөлхөнө (mega-menu нь client талд л зурагддаг тул
     цэсний холбоосыг эх кодоос уншина).
  2. URL бүрийн status, redirect, title, description, H1, canonical, robots, JSON-LD,
     орж ирэх дотоод холбоосын тоог crawl.csv-д, холбоосуудыг links.csv-д хадгална.
  3. Монгол хэлээр report.md тайлан гаргана.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\seo\crawl.ps1
  powershell -ExecutionPolicy Bypass -File scripts\seo\crawl.ps1 -Date 2026-11-01
  # Хоёр baseline-ийг харьцуулах:
  powershell -ExecutionPolicy Bypass -File scripts\seo\compare.ps1 -Old docs\baseline\2026-10-02 -New docs\baseline\2026-11-01
#>
param(
  [string]$BaseUrl = 'https://www.travelhubmongolia.com',
  [string]$Date = (Get-Date -Format 'yyyy-MM-dd'),
  [string]$OutDir,
  [string]$MenuSource,
  [int]$MaxPages = 400,
  [int]$DelayMs = 150
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
if (-not $OutDir) { $OutDir = Join-Path $repoRoot "docs\baseline\$Date" }
if (-not $MenuSource) { $MenuSource = Join-Path $repoRoot 'travel-mongolia\components\Navbar.tsx' }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $false
$http = New-Object System.Net.Http.HttpClient($handler)
$http.Timeout = [TimeSpan]::FromSeconds(30)
[void]$http.DefaultRequestHeaders.UserAgent.TryParseAdd('TravelHubSEOBaseline/1.0')

$baseUri = [Uri]$BaseUrl
$bareHost = $baseUri.Host -replace '^www\.', ''
$utf8 = New-Object System.Text.UTF8Encoding($false)

# ---------------------------------------------------------------- туслах функцууд

# Сайтын доторх холбоос бол fragment-гүй бүтэн URL буцаана, бусад үед $null
function Resolve-SiteUrl([string]$href, [Uri]$from) {
  if ([string]::IsNullOrWhiteSpace($href)) { return $null }
  $href = [System.Net.WebUtility]::HtmlDecode($href.Trim())
  if ($href -match '^(mailto:|tel:|javascript:|data:|#)') { return $null }
  try { $u = New-Object Uri($from, $href) } catch { return $null }
  if ($u.Scheme -ne 'http' -and $u.Scheme -ne 'https') { return $null }
  if (($u.Host -replace '^www\.', '') -ne $bareHost) { return $null }
  $b = New-Object UriBuilder($u)
  $b.Fragment = ''
  return $b.Uri.AbsoluteUri
}

# Query-гүй зам (sitemap, цэс хоёрыг харьцуулахад)
function Get-PathKey([string]$url) {
  $p = ([Uri]$url).AbsolutePath
  if ($p.Length -gt 1) { $p = $p.TrimEnd('/') }
  return $p
}

function Clean-Text([string]$s) {
  if ($null -eq $s) { return '' }
  $t = [regex]::Replace($s, '<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  return ([regex]::Replace($t, '\s+', ' ')).Trim()
}

function Get-Attrs([string]$tag) {
  $h = @{}
  foreach ($m in [regex]::Matches($tag, '([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"')) {
    $h[$m.Groups[1].Value.ToLower()] = [System.Net.WebUtility]::HtmlDecode($m.Groups[2].Value)
  }
  return $h
}

function Get-JsonLdTypes($node) {
  $types = @()
  if ($null -eq $node) { return $types }
  if ($node -is [System.Array]) { foreach ($n in $node) { $types += Get-JsonLdTypes $n }; return $types }
  if ($node.PSObject.Properties['@type']) { $types += @($node.'@type') }
  if ($node.PSObject.Properties['@graph']) { $types += Get-JsonLdTypes $node.'@graph' }
  return $types
}

function Invoke-Fetch([string]$url) {
  $r = @{ status = 0; location = ''; contentType = ''; body = ''; error = '' }
  try {
    $resp = $http.GetAsync($url).GetAwaiter().GetResult()
    $r.status = [int]$resp.StatusCode
    if ($resp.Headers.Location) { $r.location = (New-Object Uri([Uri]$url, $resp.Headers.Location)).AbsoluteUri }
    if ($resp.Content.Headers.ContentType) { $r.contentType = $resp.Content.Headers.ContentType.MediaType }
    if ($r.contentType -match 'html|xml|text') {
      $bytes = $resp.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult()
      $r.body = [Text.Encoding]::UTF8.GetString($bytes)
    }
    $resp.Dispose()
  } catch {
    $r.error = $_.Exception.GetBaseException().Message
  }
  return $r
}

function ConvertTo-MdCell([string]$s) { return ($s -replace '\|', '\|' -replace "`r?`n", ' ') }

# ---------------------------------------------------------------- эхлэх цэгүүд

$homeUrl = Resolve-SiteUrl '/' $baseUri

Write-Host "sitemap.xml татаж байна..."
$sitemapRaw = @()
$sitemapUrls = @()
$sm = Invoke-Fetch ($baseUri.GetLeftPart('Authority') + '/sitemap.xml')
if ($sm.status -eq 200) {
  foreach ($m in [regex]::Matches($sm.body, '<loc>\s*([^<]+?)\s*</loc>')) {
    $sitemapRaw += $m.Groups[1].Value
    $n = Resolve-SiteUrl $m.Groups[1].Value $baseUri
    if ($n) { $sitemapUrls += $n }
  }
}
$sitemapUrls = @($sitemapUrls | Select-Object -Unique)

Write-Host "Цэсний холбоосуудыг $MenuSource-оос уншиж байна..."
$menuUrls = @()
if (Test-Path $MenuSource) {
  $src = [IO.File]::ReadAllText($MenuSource, [Text.Encoding]::UTF8)
  foreach ($m in [regex]::Matches($src, 'href=\{?["''`](/[^"''`]*)["''`]')) {
    $n = Resolve-SiteUrl $m.Groups[1].Value $baseUri
    if ($n) { $menuUrls += $n }
  }
}
$menuUrls = @($menuUrls | Select-Object -Unique)

# ---------------------------------------------------------------- мөлхөлт

$queue = New-Object 'System.Collections.Generic.Queue[string]'
$seen = @{}
function Add-ToQueue([string]$u) {
  if ($u -and -not $seen.ContainsKey($u)) { $seen[$u] = $true; $queue.Enqueue($u) }
}
Add-ToQueue $homeUrl
foreach ($u in $sitemapUrls) { Add-ToQueue $u }
foreach ($u in $menuUrls) { Add-ToQueue $u }

$sitemapSet = @{}; foreach ($u in $sitemapUrls) { $sitemapSet[$u] = $true }
$menuSet = @{}; foreach ($u in $menuUrls) { $menuSet[$u] = $true }

$rows = New-Object 'System.Collections.Generic.List[object]'
$edges = New-Object 'System.Collections.Generic.List[object]'
$inlinks = @{}

while ($queue.Count -gt 0 -and $rows.Count -lt $MaxPages) {
  $url = $queue.Dequeue()
  Write-Host ("[{0}] {1}" -f ($rows.Count + 1), $url)
  $r = Invoke-Fetch $url

  $row = [ordered]@{
    url              = $url
    status           = $r.status
    redirect_to      = $r.location
    in_sitemap       = [bool]$sitemapSet[$url]
    in_menu          = [bool]$menuSet[$url]
    title            = ''
    meta_description = ''
    h1_count         = 0
    h1               = ''
    canonical        = ''
    robots           = ''
    jsonld_types     = ''
    inlinks          = 0
    error            = $r.error
  }

  if ($r.location) {
    $target = Resolve-SiteUrl $r.location ([Uri]$url)
    if ($target) { Add-ToQueue $target }
  }

  if ($r.status -eq 200 -and $r.contentType -eq 'text/html') {
    $html = $r.body
    $head = $html
    $headEnd = $html.IndexOf('</head>')
    if ($headEnd -gt 0) { $head = $html.Substring(0, $headEnd) }

    $t = [regex]::Match($head, '<title[^>]*>(.*?)</title>', 'Singleline')
    if ($t.Success) { $row.title = Clean-Text $t.Groups[1].Value }

    foreach ($m in [regex]::Matches($head, '<meta\s[^>]*>')) {
      $a = Get-Attrs $m.Value
      if ($a['name'] -eq 'description') { $row.meta_description = $a['content'] }
      if ($a['name'] -eq 'robots') { $row.robots = $a['content'] }
    }
    foreach ($m in [regex]::Matches($head, '<link\s[^>]*>')) {
      $a = Get-Attrs $m.Value
      if ($a['rel'] -eq 'canonical') { $row.canonical = $a['href'] }
    }

    $h1s = [regex]::Matches($html, '<h1\b[^>]*>(.*?)</h1>', 'Singleline')
    $row.h1_count = $h1s.Count
    if ($h1s.Count -gt 0) { $row.h1 = Clean-Text $h1s[0].Groups[1].Value }

    $types = @()
    foreach ($m in [regex]::Matches($html, '<script[^>]*application/ld\+json[^>]*>(.*?)</script>', 'Singleline')) {
      try { $types += Get-JsonLdTypes ($m.Groups[1].Value | ConvertFrom-Json) } catch { $types += 'INVALID_JSON' }
    }
    $row.jsonld_types = (@($types | Select-Object -Unique) -join ';')

    $targets = @{}
    foreach ($m in [regex]::Matches($html, '<a\b[^>]*?\shref="([^"]*)"')) {
      $target = Resolve-SiteUrl $m.Groups[1].Value ([Uri]$url)
      if ($target -and $target -ne $url) { $targets[$target] = $true }
    }
    foreach ($target in $targets.Keys) {
      $edges.Add([pscustomobject]@{ source = $url; target = $target })
      if (-not $inlinks.ContainsKey($target)) { $inlinks[$target] = 0 }
      $inlinks[$target]++
      Add-ToQueue $target
    }
  }

  $rows.Add([pscustomobject]$row)
  Start-Sleep -Milliseconds $DelayMs
}

foreach ($row in $rows) { if ($inlinks.ContainsKey($row.url)) { $row.inlinks = $inlinks[$row.url] } }
$notCrawled = $queue.Count

$csvPath = Join-Path $OutDir 'crawl.csv'
$rows | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
$edges | Sort-Object target, source | Export-Csv -Path (Join-Path $OutDir 'links.csv') -NoTypeInformation -Encoding UTF8

# ---------------------------------------------------------------- тайлан

$byUrl = @{}; foreach ($row in $rows) { $byUrl[$row.url] = $row }
$okHtml = @($rows | Where-Object { $_.status -eq 200 })
# ?region= гэх мэт query хувилбарууд нь ижил хуудас тул давхардлын шалгалтад оруулахгүй
$okPages = @($okHtml | Where-Object { ([Uri]$_.url).Query -eq '' })

function Test-DynamicPath([string]$path) {
  return ($path -match '^/(province|recommendation)/' -or
          $path -match '^/destination/heritage/.+' -or
          $path -match '/[A-Za-z0-9]{15,}$')
}

$sb = New-Object System.Text.StringBuilder
function W([string]$line = '') { [void]$sb.AppendLine($line) }

W "# SEO baseline: $($baseUri.Host) ($Date)"
W ''
W "Энэ тайланг ``scripts/seo/crawl.ps1`` автоматаар үүсгэсэн. Өгөгдөл: ``crawl.csv`` (URL бүрийн мэдээлэл), ``links.csv`` (дотоод холбоосууд)."
W ''
W '## Тойм'
W ''
W "- Мөлхсөн URL: **$($rows.Count)**"
if ($notCrawled -gt 0) { W "- Хязгаар ($MaxPages)-аас хэтэрсэн тул мөлхөгдөөгүй URL: **$notCrawled**" }
W "- sitemap.xml: status $($sm.status), **$($sitemapRaw.Count)** URL"
$nonCanonHost = @($sitemapRaw | Where-Object { -not $_.StartsWith($baseUri.GetLeftPart('Authority')) })
W "- sitemap-д ``$($baseUri.GetLeftPart('Authority'))``-оор эхлээгүй URL: **$($nonCanonHost.Count)**"
W "- Цэсний (Navbar.tsx) дотоод холбоос: **$($menuUrls.Count)**"
W ''
W '| Status | Тоо |'
W '|---|---|'
foreach ($g in ($rows | Group-Object status | Sort-Object Name)) { W "| $($g.Name) | $($g.Count) |" }
W ''

# --- Эвдэрсэн холбоос
W '## 1. Эвдэрсэн холбоосууд'
W ''
W 'Сайтын хуудас эсвэл цэснээс заасан боловч 4xx/5xx буцаадаг хаягууд.'
W ''
$broken = @($rows | Where-Object { $_.status -ge 400 -or $_.status -eq 0 })
$brokenLinked = @($broken | Where-Object { $_.in_menu -or $inlinks.ContainsKey($_.url) })
if ($brokenLinked.Count -eq 0) { W '_Олдсонгүй._' } else {
  W '| Эвдэрсэн хаяг | Status | Хаанаас холбогдсон |'
  W '|---|---|---|'
  foreach ($b in $brokenLinked) {
    $from = @()
    if ($b.in_menu) { $from += 'Цэс (Navbar.tsx)' }
    $srcs = @($edges | Where-Object { $_.target -eq $b.url } | ForEach-Object { Get-PathKey $_.source } | Select-Object -Unique)
    if ($srcs.Count -gt 0) {
      $shown = ($srcs | Select-Object -First 3) -join ', '
      if ($srcs.Count -gt 3) { $shown += " (+$($srcs.Count - 3) хуудас)" }
      $from += $shown
    }
    W "| ``$(Get-PathKey $b.url)$(([Uri]$b.url).Query)`` | $($b.status) | $(ConvertTo-MdCell ($from -join '; ')) |"
  }
}
W ''

# --- 404
W '## 2. 404 болон алдаатай хуудсууд'
W ''
if ($broken.Count -eq 0) { W '_Олдсонгүй._' } else {
  W '| URL | Status | sitemap-д | Цэсэнд | Орж ирэх холбоос |'
  W '|---|---|---|---|---|'
  foreach ($b in $broken) {
    $sm1 = if ($b.in_sitemap) { 'тийм' } else { '' }
    $mn1 = if ($b.in_menu) { 'тийм' } else { '' }
    W "| ``$($b.url)`` | $($b.status) $($b.error) | $sm1 | $mn1 | $($b.inlinks) |"
  }
}
W ''

# --- Redirect
$redirects = @($rows | Where-Object { $_.status -ge 300 -and $_.status -lt 400 })
W '## 3. Redirect'
W ''
if ($redirects.Count -eq 0) { W '_Олдсонгүй._' } else {
  W '| URL | Status | Хаашаа |'
  W '|---|---|---|'
  foreach ($r in $redirects) { W "| ``$($r.url)`` | $($r.status) | ``$($r.redirect_to)`` |" }
}
W ''

# --- Title / description
W '## 4. Title болон meta description'
W ''
W "Шалгасан хуудас: $($okPages.Count). ``?region=`` гэх мэт query-тэй хувилбаруудыг үндсэн хуудастайгаа ижил тул энд оруулаагүй."
W ''
function Write-Dupes([string]$field, [string]$label) {
  $empty = @($okPages | Where-Object { [string]::IsNullOrWhiteSpace($_.$field) })
  W "### Хоосон $label ($($empty.Count))"
  W ''
  if ($empty.Count -eq 0) { W '_Олдсонгүй._' } else { foreach ($e in $empty) { W "- ``$(Get-PathKey $e.url)``" } }
  W ''
  $dupes = @($okPages | Where-Object { -not [string]::IsNullOrWhiteSpace($_.$field) } | Group-Object $field | Where-Object { $_.Count -gt 1 } | Sort-Object Count -Descending)
  W "### Давхардсан $label ($($dupes.Count) бүлэг)"
  W ''
  if ($dupes.Count -eq 0) { W '_Олдсонгүй._' } else {
    foreach ($d in $dupes) {
      W "- **$($d.Count) хуудас**: ""$(ConvertTo-MdCell $d.Name)"""
      foreach ($p in ($d.Group | Select-Object -First 8)) { W "  - ``$(Get-PathKey $p.url)``" }
      if ($d.Count -gt 8) { W "  - ... +$($d.Count - 8)" }
    }
  }
  W ''
}
Write-Dupes 'title' 'title'
Write-Dupes 'meta_description' 'description'

# --- H1
W '## 5. H1'
W ''
$noH1 = @($okPages | Where-Object { [int]$_.h1_count -eq 0 })
$multiH1 = @($okPages | Where-Object { [int]$_.h1_count -gt 1 })
W "### H1 байхгүй хуудас ($($noH1.Count))"
W ''
if ($noH1.Count -eq 0) { W '_Олдсонгүй._' } else { foreach ($p in $noH1) { W "- ``$(Get-PathKey $p.url)`` ($(ConvertTo-MdCell $p.title))" } }
W ''
W "### Нэгээс олон H1-тэй хуудас ($($multiH1.Count))"
W ''
if ($multiH1.Count -eq 0) { W '_Олдсонгүй._' } else { foreach ($p in $multiH1) { W "- ``$(Get-PathKey $p.url)``: $($p.h1_count) H1" } }
W ''

# --- sitemap ба цэс
$sitemapPaths = @{}; foreach ($u in $sitemapUrls) { $sitemapPaths[(Get-PathKey $u)] = $u }
$menuPaths = @{}; foreach ($u in $menuUrls) { $menuPaths[(Get-PathKey $u)] = $u }

W '## 6. sitemap-д байгаа ч цэснээс холбоосгүй хуудсууд'
W ''
W 'Query болон #-ийг хасаад замаар нь харьцуулсан. Contentful-ийн динамик хуудсууд (аймаг, түүхэн өв, зөвлөмж, онцлох газар) цэсэнд байх албагүй тул тусад нь жагсаав. Тэдгээрт бусад хуудаснаас холбоос байгаа эсэхийг "Орж ирэх холбоос" баганаас харна.'
W ''
$smOnly = @($sitemapPaths.Keys | Where-Object { -not $menuPaths.ContainsKey($_) } | Sort-Object)
$smOnlyStatic = @($smOnly | Where-Object { -not (Test-DynamicPath $_) })
$smOnlyDynamic = @($smOnly | Where-Object { Test-DynamicPath $_ })
W "### Статик хуудас ($($smOnlyStatic.Count))"
W ''
if ($smOnlyStatic.Count -eq 0) { W '_Олдсонгүй._' } else {
  W '| Зам | Орж ирэх холбоос |'
  W '|---|---|'
  foreach ($p in $smOnlyStatic) { $r = $byUrl[$sitemapPaths[$p]]; W "| ``$p`` | $(if ($r) { $r.inlinks } else { '?' }) |" }
}
W ''
W "### Динамик (Contentful) хуудас ($($smOnlyDynamic.Count))"
W ''
if ($smOnlyDynamic.Count -eq 0) { W '_Олдсонгүй._' } else {
  W '| Зам | Гарчиг | Орж ирэх холбоос |'
  W '|---|---|---|'
  foreach ($p in $smOnlyDynamic) { $r = $byUrl[$sitemapPaths[$p]]; W "| ``$p`` | $(if ($r) { ConvertTo-MdCell $r.title }) | $(if ($r) { $r.inlinks } else { '?' }) |" }
}
W ''

W '## 7. Цэсэнд байгаа ч sitemap-д ороогүй хуудсууд'
W ''
$menuOnly = @($menuPaths.Keys | Where-Object { -not $sitemapPaths.ContainsKey($_) } | Sort-Object)
if ($menuOnly.Count -eq 0) { W '_Олдсонгүй._' } else {
  W '| Зам | Status |'
  W '|---|---|'
  foreach ($p in $menuOnly) { $r = $byUrl[$menuPaths[$p]]; W "| ``$p`` | $(if ($r) { $r.status } else { '?' }) |" }
}
W ''

# --- Орж ирэх холбоосгүй
W '## 8. Сайтын аль ч хуудаснаас холбоосгүй (orphan) хуудсууд'
W ''
W 'sitemap-д байгаа, 200 буцаадаг ч мөлхсөн HTML-ийн аль ч хуудаснаас `<a href>` холбоос ирдэггүй хуудсууд. Цэсний холбоосууд browser дээр л зурагддаг тул Google тэдгээрийг харахгүй байж магадгүй гэдгийг анхаарна уу.'
W ''
$orphans = @($rows | Where-Object { $_.in_sitemap -and $_.status -eq 200 -and [int]$_.inlinks -eq 0 -and $_.url -ne $homeUrl })
if ($orphans.Count -eq 0) { W '_Олдсонгүй._' } else {
  W '| Зам | Цэсэнд |'
  W '|---|---|'
  foreach ($o in $orphans) { W "| ``$(Get-PathKey $o.url)`` | $(if ($o.in_menu) { 'тийм' } else { '' }) |" }
}
W ''

# --- canonical
W '## 9. Canonical'
W ''
$canonIssues = @($okPages | Where-Object { $_.canonical -eq '' -or ((Resolve-SiteUrl $_.canonical $baseUri) -ne $_.url) })
if ($canonIssues.Count -eq 0) { W '_Бүх хуудасны canonical өөрийн хаягтайгаа таарч байна._' } else {
  W '| URL | Canonical |'
  W '|---|---|'
  foreach ($c in $canonIssues) { W "| ``$(Get-PathKey $c.url)`` | $(if ($c.canonical) { '`' + $c.canonical + '`' } else { '_байхгүй_' }) |" }
}
W ''

# --- robots meta
$noindex = @($okHtml | Where-Object { $_.robots -match 'noindex' })
W '## 10. noindex'
W ''
if ($noindex.Count -eq 0) { W '_noindex-тэй хуудас олдсонгүй._' } else { foreach ($n in $noindex) { W "- ``$($n.url)``: $($n.robots)" } }
W ''

W '## Дахин ажиллуулах'
W ''
W '```powershell'
W 'powershell -ExecutionPolicy Bypass -File scripts\seo\crawl.ps1                  # өнөөдрийн огноогоор'
W 'powershell -ExecutionPolicy Bypass -File scripts\seo\compare.ps1 -Old docs\baseline\2026-10-02 -New docs\baseline\<шинэ огноо>'
W '```'

[IO.File]::WriteAllText((Join-Path $OutDir 'report.md'), $sb.ToString(), $utf8)
$http.Dispose()
Write-Host ""
Write-Host "Дууслаа: $($rows.Count) URL. $OutDir"
