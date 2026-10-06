# Шинэ төрөл бүрт 2 жишээ entry ("[ЖИШЭЭ]"-ээр эхэлсэн нэртэй) үүсгэж нийтэлнэ.
# Entry ID нь тогтмол (sample-...) тул дахин ажиллуулахад давхардахгүй, байгааг алгасна.
# Сайт production дээр "[ЖИШЭЭ]" entry-г харуулдаггүй (lib/localContent.ts).
# Go-live-ийн өмнө устгах: docs/plan/sample-entries.md, эсвэл -Remove.
#
# Ажиллуулах: powershell -ExecutionPolicy Bypass -File scripts\contentful\03-sample-entries.ps1 [-DryRun] [-Remove]

param([switch]$DryRun, [switch]$Remove)

. "$PSScriptRoot\_common.ps1"

function Doc([string[]]$paragraphs) {
  return @{
    nodeType = 'document'; data = @{}
    content = @($paragraphs | ForEach-Object {
      @{ nodeType = 'paragraph'; data = @{}; content = @(@{ nodeType = 'text'; value = $_; marks = @(); data = @{} }) }
    })
  }
}
function EntryLink([string]$id) { return @{ sys = @{ type = 'Link'; linkType = 'Entry'; id = $id } } }

$samples = @(
  # ---------------------------------------------------------------- localProvider
  @{ id = 'sample-provider-herder'; type = 'localProvider'; fields = @{
    name = '[ЖИШЭЭ] Малчин өрх'; slug = 'sample-herder-family'; providerType = 'herder-family'
    province = 'Архангай'; location = @{ lat = 47.86; lon = 101.25 }
    story = (Doc @('Жишээ entry: энд өрхийн тухай товч түүх бичнэ. Хэдэн үе мал маллаж ирсэн, ямар мал голлон тэжээдэг, зочдыг хэрхэн хүлээн авдаг вэ.'))
    services = @('Гэрт хоноглох', 'Сүү саах, цагаан идээ хийх', 'Морь унах')
    priceFrom = '120,000₮ / хүн / хоног'; localOwned = $true
    communityParticipation = 'Жишээ: орлого шууд өрхөд очдог, хоолны түүхий эдийг хөршүүдээсээ авдаг.'
    responsiblePractices = @('Жижиг бүлэг (6 хүртэл)', 'Хог хаягдлаа буцааж авах')
    womenOrYouthLed = $true
  } },
  @{ id = 'sample-provider-guide'; type = 'localProvider'; fields = @{
    name = '[ЖИШЭЭ] Нутгийн хөтөч'; slug = 'sample-local-guide'; providerType = 'guide'
    province = 'Хөвсгөл'
    story = (Doc @('Жишээ entry: хөтчийн туршлага, мэддэг хэл, хамгийн сайн мэддэг нутаг.'))
    services = @('Явган аялал хөтлөх', 'Морин аялал')
    priceFrom = '150,000₮ / өдөр'; localOwned = $true
    licenseIfRequired = 'Жишээ: хөтчийн үнэмлэхийн дугаар энд'
    responsiblePractices = @('Тэмдэглэсэн замаар явах')
    womenOrYouthLed = $false
  } },
  # ---------------------------------------------------------------- communityExperience
  @{ id = 'sample-experience-herding'; type = 'communityExperience'; fields = @{
    title = '[ЖИШЭЭ] Малчин айлд нэг өдөр'; slug = 'sample-day-with-herders'
    host = (EntryLink 'sample-provider-herder'); province = 'Архангай'
    community = 'Жишээ: зохион байгуулагч өрх болон хөрш 2 өрх оролцоно.'
    duration = '1 өдөр'; groupSize = '2–6 хүн'
    whatYouDo = (Doc @('Жишээ entry: өглөө мал гаргах, сүү саах, үдээс хойш эсгий хийх зэрэг үйл ажиллагааг дарааллаар нь бичнэ.'))
    culturalGuidance = 'Гэрт орохдоо босгон дээр гишгэхгүй. Хүн, гэрийн зургийг зөвшөөрөл авч байж авна.'
    price = '90,000₮ / хүн'; season = '6–9 сар'
  } },
  @{ id = 'sample-experience-felt'; type = 'communityExperience'; fields = @{
    title = '[ЖИШЭЭ] Эсгий хийх'; slug = 'sample-felt-making'
    host = (EntryLink 'sample-provider-herder'); province = 'Архангай'
    community = 'Жишээ: өрхийн эмэгтэйчүүд заадаг.'
    duration = '3 цаг'; groupSize = '2–8 хүн'
    whatYouDo = (Doc @('Жишээ entry: ноос цохих, дэвсэх, эсгий өнхрүүлэх үе шатууд.'))
    culturalGuidance = 'Ажлын үеэр гэрийн эзний зааврыг дагана.'
    price = '50,000₮ / хүн'; season = 'Жилийн турш'
  } },
  # ---------------------------------------------------------------- localProduct
  @{ id = 'sample-product-aaruul'; type = 'localProduct'; fields = @{
    name = '[ЖИШЭЭ] Ааруул'; slug = 'sample-aaruul'
    producer = (EntryLink 'sample-provider-herder'); origin = 'Архангай'
    story = (Doc @('Жишээ entry: бүтээгдэхүүнийг хэрхэн хийдэг, ямар уламжлалтай вэ.'))
    season = 'Зун, намар'; whereToBuy = 'Жишээ: өрхөөс шууд, эсвэл сумын төвийн дэлгүүр.'
    relatedExperience = @((EntryLink 'sample-experience-herding'))
  } },
  @{ id = 'sample-product-felt-slippers'; type = 'localProduct'; fields = @{
    name = '[ЖИШЭЭ] Эсгий шаахай'; slug = 'sample-felt-slippers'
    producer = (EntryLink 'sample-provider-herder'); origin = 'Архангай'
    story = (Doc @('Жишээ entry: гар урлалын бүтээгдэхүүний түүх.'))
    season = 'Жилийн турш'; whereToBuy = 'Жишээ: эсгий хийх туршлагын үеэр.'
    relatedExperience = @((EntryLink 'sample-experience-felt'))
  } },
  # ---------------------------------------------------------------- visitorGuidance
  @{ id = 'sample-guidance-khuvsgul'; type = 'visitorGuidance'; fields = @{
    title = '[ЖИШЭЭ] Хөвсгөл нуурын зөвлөмж'; place = (EntryLink '5gHuNvalGv5MYMexAUrWEX')
    culturalEtiquette = @('Жишээ: цаатан айлд зочлохдоо урьдчилан зөвшөөрөл авна.')
    natureGuidance = @('Жишээ: нуурын эрэгт угаалга хийхгүй.')
    safety = @('Жишээ: мөсөн дээр гарахаас өмнө зузааныг шалгуулна.')
    season = 'Жилийн турш'; source = 'Жишээ: эх сурвалжийг энд бичнэ.'
  } },
  @{ id = 'sample-guidance-orkhon'; type = 'visitorGuidance'; fields = @{
    title = '[ЖИШЭЭ] Орхоны хөндийн зөвлөмж'; place = (EntryLink '3t2W7uicg4pU7wXuhVuE4M')
    culturalEtiquette = @('Жишээ: хийдэд нар зөв тойрно.')
    natureGuidance = @('Жишээ: дурсгалт газрын чулуунд гар хүрэхгүй.')
    safety = @('Жишээ: зуны аадар борооны үед голын гатлагыг шалгана.')
    season = 'Зун'; source = 'Жишээ: эх сурвалжийг энд бичнэ.'
  } },
  # ---------------------------------------------------------------- event
  @{ id = 'sample-event-eagle'; type = 'event'; fields = @{
    title = '[ЖИШЭЭ] Бүргэдийн баяр'; slug = 'sample-eagle-festival'
    startDate = '2027-10-02'; endDate = '2027-10-03'
    organizer = 'Жишээ: аймгийн зохион байгуулах хороо'; province = 'Баян-Өлгий'
    culturalMeaning = (Doc @('Жишээ entry: арга хэмжээний түүх, утга учир.'))
    howToParticipate = @('Жишээ: бүргэдчдийн зургийг зөвшөөрөлтэй авна.', 'Жишээ: шувуунд ойртохгүй.')
    localServices = @((EntryLink 'sample-provider-guide'))
  } },
  @{ id = 'sample-event-soum-naadam'; type = 'event'; fields = @{
    title = '[ЖИШЭЭ] Сумын наадам'; slug = 'sample-soum-naadam'
    startDate = '2027-07-20'
    organizer = 'Жишээ: сумын Засаг даргын тамгын газар'; province = 'Архангай'
    culturalMeaning = (Doc @('Жишээ entry: эрийн гурван наадмын утга.'))
    howToParticipate = @('Жишээ: морин уралдааны замд гарахгүй.')
    localServices = @((EntryLink 'sample-provider-herder'))
  } },
  # ---------------------------------------------------------------- story
  @{ id = 'sample-story-nomadic'; type = 'story'; fields = @{
    title = '[ЖИШЭЭ] Хаваржааны өглөө'; slug = 'sample-spring-camp-morning'; topic = 'nomadic'
    body = (Doc @('Жишээ entry: нийтлэлийн бүтэн текст энд орно.'))
    location = 'Архангай'; relatedExperience = @((EntryLink 'sample-experience-herding'))
    source = 'Жишээ: ярилцлага, 2026 он'; storyteller = 'Жишээ ярилцагч'; editor = 'Жишээ редактор'
    consentObtained = $true; language = 'mn'; updatedDate = '2026-10-06'
  } },
  @{ id = 'sample-story-food'; type = 'story'; fields = @{
    title = '[ЖИШЭЭ] Ааруул хатаах'; slug = 'sample-drying-aaruul'; topic = 'food'
    body = (Doc @('Жишээ entry: нийтлэлийн бүтэн текст энд орно.'))
    location = 'Архангай'; relatedProduct = @((EntryLink 'sample-product-aaruul'))
    source = 'Жишээ: ярилцлага, 2026 он'; storyteller = 'Жишээ ярилцагч'; editor = 'Жишээ редактор'
    consentObtained = $true; language = 'mn'; updatedDate = '2026-10-06'
  } }
)

if ($Remove) {
  # Холбоос хадгалсан entry-г эхэлж устгахын тулд урвуу дарааллаар
  [array]::Reverse($samples)
  foreach ($s in $samples) {
    $e = Invoke-Cma -Path "/entries/$($s.id)"
    if ($null -eq $e) { continue }
    Write-Host "Устгана: $($s.id)"
    if ($DryRun) { continue }
    if ($e.sys.publishedVersion) { $e = Invoke-Cma -Method DELETE -Path "/entries/$($s.id)/published" -Version $e.sys.version }
    Invoke-Cma -Method DELETE -Path "/entries/$($s.id)" -Version $e.sys.version | Out-Null
  }
  Write-Host 'Дууслаа.'
  return
}

foreach ($s in $samples) {
  $existing = Invoke-Cma -Path "/entries/$($s.id)"
  if ($null -ne $existing) { Write-Host "Байгаа: $($s.id)"; continue }
  Write-Host "Үүсгэнэ: $($s.id) ($($s.type))"
  if ($DryRun) { continue }
  $fields = @{}
  foreach ($k in $s.fields.Keys) { $fields[$k] = @{ $script:Locale = $s.fields[$k] } }
  $e = Invoke-Cma -Method PUT -Path "/entries/$($s.id)" -Body @{ fields = $fields } -ContentType $s.type
  Invoke-Cma -Method PUT -Path "/entries/$($s.id)/published" -Version $e.sys.version | Out-Null
}
Write-Host 'Дууслаа.'
