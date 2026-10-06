# Б хэсгийн шинэ Contentful төрлүүд (docs/TravelHubMongolia_2.0.md 7, 8, 9, 12, 13-р хэсэг):
# story, localProvider, communityExperience, localProduct, visitorGuidance, event.
#
# Дахин ажиллуулж болно:
#   - Төрөл байхгүй бол үүсгэж нийтэлнэ.
#   - Төрөл байвал зөвхөн дутуу талбарыг нэмнэ. Байгаа талбар, entry-д хүрэхгүй.
#   - Талбар бүрийн монгол тайлбарыг (help text) хоосон байвал л бичнэ.
# Ажиллуулах: powershell -ExecutionPolicy Bypass -File scripts\contentful\01-content-types.ps1 [-DryRun]

param([switch]$DryRun)

. "$PSScriptRoot\_common.ps1"

$P = $script:SlugPattern
$slugHelp = 'Хаягт харагдах нэр. Зөвхөн латин жижиг үсэг, тоо, зураас (жишээ: tsetsgeegiin-malchin-ail). Нийтэлсний дараа өөрчилбөл хуучин холбоос ажиллахгүй.'
$photosHelp = 'Зураг (JPG, хамгийн багадаа 1600 px өргөн). Эхний зураг нүүр зураг болно. Зөвхөн зөвшөөрөлтэй, бодит зураг.'
$provinceHelp = 'Аймгийн нэр, жишээ: Архангай. Хот бол Улаанбаатар.'
$bookingHelp = 'Захиалгын бүтэн хаяг (https://...). Хоосон бол "Захиалах" товч joinme.mn руу очно.'

$types = @(
  @{
    id = 'story'; name = 'Нийтлэл, түүх (Story)'; displayField = 'title'
    description = 'Түүх & өв hub (/stories)-д харагдах нийтлэл, фото/видео түүх.'
    fields = @(
      (New-Field -Id title -Name 'Гарчиг' -Type Symbol -Required -Help 'Нийтлэлийн гарчиг, 60 тэмдэгтээс ихгүй.')
      (New-Field -Id slug -Name 'Slug' -Type Symbol -Required -Unique -Regexp $P -Help $slugHelp)
      (New-Field -Id topic -Name 'Сэдэв' -Type Symbol -Required -In @('culture','nature','nomadic','food','people','photo-video') -Help 'Аль хэсэгт харагдахыг сонгоно: culture соёл, nature байгаль, nomadic нүүдэлчин ахуй, food хоол, people хүмүүс, photo-video фото/видео.')
      (New-Field -Id body -Name 'Агуулга' -Type RichText -Help 'Нийтлэлийн бүтэн текст. Гарчиг, догол мөр, жагсаалт ашиглаж болно.')
      (New-Field -Id media -Name 'Зураг' -Type Array -ItemsType Link -ItemsLinkType Asset -Help $photosHelp)
      (New-Field -Id videoUrl -Name 'Видео холбоос' -Type Symbol -Regexp '^https?://' -Help 'YouTube эсвэл Vimeo-ийн холбоос. Видеогүй бол хоосон.')
      (New-Field -Id location -Name 'Байршил' -Type Symbol -Help 'Түүх болсон газар, жишээ: Архангай, Цэнхэр сум.')
      (New-Field -Id relatedPlace -Name 'Холбоотой газар' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('destination','heritagePlace','province') -Help 'Нийтлэлд гардаг газар, өв, аймаг.')
      (New-Field -Id relatedExperience -Name 'Холбоотой туршлага' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('communityExperience') -Help 'Уншигч оролцож болох нутгийн туршлага.')
      (New-Field -Id relatedProduct -Name 'Холбоотой бүтээгдэхүүн' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('localProduct') -Help 'Нийтлэлд гардаг нутгийн бүтээгдэхүүн.')
      (New-Field -Id source -Name 'Эх сурвалж' -Type Text -Help 'Мэдээллийн эх сурвалж: ярилцлага, ном, байгууллага, холбоос.')
      (New-Field -Id storyteller -Name 'Ярилцагч / өгүүлэгч' -Type Symbol -Help 'Түүхийг ярьсан хүн, өрх. Нэрийг зөвшөөрөлтэй бол л бичнэ.')
      (New-Field -Id editor -Name 'Хариуцсан редактор' -Type Symbol -Help 'Нийтлэлийг шалгасан редакторын нэр.')
      (New-Field -Id consentObtained -Name 'Зөвшөөрөл авсан' -Type Boolean -Help 'Аман түүх, зураг, уламжлалт мэдлэгийг нийтлэх зөвшөөрлийг тухайн хүн, өрхөөс авсан бол "Yes". Аваагүй бол нийтлэхгүй.')
      (New-Field -Id language -Name 'Хэл' -Type Symbol -In @('mn','en','zh') -Help 'Нийтлэлийн хэл: mn монгол, en англи, zh хятад.')
      (New-Field -Id updatedDate -Name 'Шинэчилсэн огноо' -Type Date -Help 'Агуулгыг сүүлд шалгаж шинэчилсэн огноо.')
    )
  },
  @{
    id = 'localProvider'; name = 'Нутгийн үйлчилгээ үзүүлэгч (Local Provider)'; displayField = 'name'
    description = 'Малчин өрх, хөтөч, гар урлаач, хоол, жижиг бизнес, байр (/local).'
    fields = @(
      (New-Field -Id name -Name 'Нэр' -Type Symbol -Required -Help 'Өрх, хүн, бизнесийн нэр. Жишээ: Цэцгээгийн малчин айл.')
      (New-Field -Id slug -Name 'Slug' -Type Symbol -Required -Unique -Regexp $P -Help $slugHelp)
      (New-Field -Id providerType -Name 'Төрөл' -Type Symbol -Required -In @('herder-family','guide','artisan','food','small-business','accommodation') -Help 'herder-family малчин өрх, guide хөтөч, artisan гар урлаач, food хоол, small-business жижиг бизнес, accommodation байр.')
      (New-Field -Id province -Name 'Аймаг' -Type Symbol -Help $provinceHelp)
      (New-Field -Id location -Name 'Байршил (газрын зураг)' -Type Location -Help 'Газрын зураг дээр цэг тавина. Гэрийн яг байршлыг биш, сум/бүсийг заахад хангалттай.')
      (New-Field -Id story -Name 'Хэн бэ (түүх)' -Type RichText -Help 'Өрх, хүний тухай товч түүх: хэдэн жил энэ ажлыг хийж байгаа, юугаараа онцлог.')
      (New-Field -Id services -Name 'Үйлчилгээ' -Type Array -ItemsType Symbol -Help 'Үйлчилгээ бүрийг тусад нь бичээд Enter дарна. Жишээ: Гэрт хоноглох, Морин аялал.')
      (New-Field -Id priceFrom -Name 'Үнэ (-аас эхлэн)' -Type Symbol -Help 'Жишээ: 120,000₮ / хүн / хоног. Үнэ тогтоогүй бол хоосон.')
      (New-Field -Id bookingUrl -Name 'Захиалгын холбоос' -Type Symbol -Regexp '^https?://' -Help $bookingHelp)
      (New-Field -Id contact -Name 'Холбоо барих' -Type Symbol -Help 'Утас эсвэл и-мэйл. Тухайн хүний зөвшөөрөлтэй бол л бичнэ.')
      (New-Field -Id localOwned -Name 'Нутгийн өмчлөлтэй' -Type Boolean -Help 'Тухайн нутгийн хүн, өрх эзэмшдэг бол "Yes". "Нутгийн үйлчилгээ үзүүлэгч" тэмдэг харагдана.')
      (New-Field -Id communityParticipation -Name 'Нутгийн оролцоо' -Type Text -Help 'Нутгийн иргэд хэрхэн оролцож, ямар өгөөж хүртдэг вэ. Бөглөсөн бол "Нутгийн иргэдэд түшиглэсэн" тэмдэг харагдана. Нотолгоогүй зүйл бичихгүй.')
      (New-Field -Id responsiblePractices -Name 'Хариуцлагатай дадал' -Type Array -ItemsType Symbol -Help 'Бодитоор хэрэгжүүлдэг дадал, тус бүрийг тусад нь. Жишээ: Хуванцар савгүй, Жижиг бүлэг. "Eco", "green" гэх мэт нотолгоогүй үг бичихгүй.')
      (New-Field -Id recognizedCertification -Name 'Хүлээн зөвшөөрөгдсөн гэрчилгээ' -Type Symbol -Help 'Гаднын байгууллагын олгосон гэрчилгээний нэр. Байгаа бол л бичнэ.')
      (New-Field -Id licenseIfRequired -Name 'Тусгай зөвшөөрөл' -Type Symbol -Help 'Хууль ёсоор шаардлагатай тусгай зөвшөөрөл, лицензийн дугаар (хөтөч, байр г.м.).')
      (New-Field -Id womenOrYouthLed -Name 'Эмэгтэйчүүд / залуучууд удирддаг' -Type Boolean -Help 'Эмэгтэй эсвэл залуу хүн удирддаг бол "Yes".')
      (New-Field -Id photos -Name 'Зураг' -Type Array -ItemsType Link -ItemsLinkType Asset -Help $photosHelp)
    )
  },
  @{
    id = 'communityExperience'; name = 'Нутгийн туршлага (Community Experience)'; displayField = 'title'
    description = 'Нутгийн иргэдийн зохион байгуулдаг туршлага (/local/experiences).'
    fields = @(
      (New-Field -Id title -Name 'Гарчиг' -Type Symbol -Required -Help 'Туршлагын нэр. Жишээ: Малчин айлд нэг өдөр.')
      (New-Field -Id slug -Name 'Slug' -Type Symbol -Required -Unique -Regexp $P -Help $slugHelp)
      (New-Field -Id host -Name 'Зохион байгуулагч' -Type Link -LinkType Entry -LinkContentTypes @('localProvider') -Help 'Туршлагыг зохион байгуулдаг нутгийн үйлчилгээ үзүүлэгч. Эхлээд түүнийг "Local Provider"-оор нэмнэ.')
      (New-Field -Id community -Name 'Нутгийн оролцоо' -Type Text -Help 'Ямар нутгийн иргэд, өрх оролцож, өгөөж хүртдэг вэ.')
      (New-Field -Id province -Name 'Аймаг' -Type Symbol -Help $provinceHelp)
      (New-Field -Id duration -Name 'Хугацаа' -Type Symbol -Help 'Жишээ: 3 цаг, 1 өдөр / 1 шөнө.')
      (New-Field -Id groupSize -Name 'Бүлгийн хэмжээ' -Type Symbol -Help 'Жишээ: 2–6 хүн.')
      (New-Field -Id whatYouDo -Name 'Юу хийх, мэдрэх вэ' -Type RichText -Help 'Туршлагын үеэр юу хийж, юу сурахыг дарааллаар нь бичнэ.')
      (New-Field -Id culturalGuidance -Name 'Соёлын зөв харилцаа' -Type Text -Help 'Оролцогч юуг анхаарах вэ: ёс заншил, хувцас, зураг авах зөвшөөрөл.')
      (New-Field -Id price -Name 'Үнэ' -Type Symbol -Help 'Жишээ: 80,000₮ / хүн.')
      (New-Field -Id season -Name 'Улирал' -Type Symbol -Help 'Жишээ: 6–9 сар, жилийн турш.')
      (New-Field -Id bookingUrl -Name 'Захиалгын холбоос' -Type Symbol -Regexp '^https?://' -Help $bookingHelp)
      (New-Field -Id photos -Name 'Зураг' -Type Array -ItemsType Link -ItemsLinkType Asset -Help $photosHelp)
    )
  },
  @{
    id = 'localProduct'; name = 'Нутгийн бүтээгдэхүүн (Local Product)'; displayField = 'name'
    description = 'Нутгийн хоол, гар урлал, бүтээгдэхүүн (/local/products).'
    fields = @(
      (New-Field -Id name -Name 'Нэр' -Type Symbol -Required -Help 'Бүтээгдэхүүний нэр. Жишээ: Хужир давстай ааруул.')
      (New-Field -Id slug -Name 'Slug' -Type Symbol -Required -Unique -Regexp $P -Help $slugHelp)
      (New-Field -Id producer -Name 'Үйлдвэрлэгч' -Type Link -LinkType Entry -LinkContentTypes @('localProvider') -Help 'Хийдэг нутгийн үйлчилгээ үзүүлэгч (өрх, гар урлаач).')
      (New-Field -Id origin -Name 'Гарал үүсэл' -Type Symbol -Help 'Хаана хийдэг вэ. Жишээ: Өвөрхангай, Хужирт сум.')
      (New-Field -Id story -Name 'Бүтээгдэхүүний түүх' -Type RichText -Help 'Хэрхэн хийдэг, ямар уламжлалтай вэ.')
      (New-Field -Id season -Name 'Улирал' -Type Symbol -Help 'Хэзээ олдох вэ. Жишээ: Зун, намар.')
      (New-Field -Id whereToBuy -Name 'Хаанаас авах' -Type Text -Help 'Худалдаж авах газар, дэлгүүр, холбоос.')
      (New-Field -Id relatedExperience -Name 'Холбоотой туршлага' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('communityExperience') -Help 'Бүтээгдэхүүнийг хийж үзэх, амтлах туршлага.')
      (New-Field -Id photos -Name 'Зураг' -Type Array -ItemsType Link -ItemsLinkType Asset -Help $photosHelp)
    )
  },
  @{
    id = 'visitorGuidance'; name = 'Аялагчийн зөвлөмж (Visitor Guidance)'; displayField = 'title'
    description = 'Тухайн газарт мөрдөх ёс, байгаль хамгаалал, аюулгүй байдлын зөвлөмж.'
    fields = @(
      (New-Field -Id title -Name 'Гарчиг (дотоод)' -Type Symbol -Required -Help 'Contentful дотор танихад зориулсан нэр. Жишээ: Хөвсгөл нуурын зөвлөмж.')
      (New-Field -Id place -Name 'Газар' -Type Link -LinkType Entry -LinkContentTypes @('destination','heritagePlace','province') -Help 'Зөвлөмж хамаарах газар, өв, аймаг.')
      (New-Field -Id culturalEtiquette -Name 'Соёлын ёс' -Type Array -ItemsType Symbol -Help 'Зөвлөмж бүрийг тусад нь бичээд Enter дарна.')
      (New-Field -Id natureGuidance -Name 'Байгаль хамгаалал' -Type Array -ItemsType Symbol -Help 'Зөвлөмж бүрийг тусад нь бичээд Enter дарна.')
      (New-Field -Id safety -Name 'Аюулгүй байдал' -Type Array -ItemsType Symbol -Help 'Зөвлөмж бүрийг тусад нь бичээд Enter дарна.')
      (New-Field -Id season -Name 'Улирал' -Type Symbol -Help 'Аль улиралд хамаарах вэ. Бүх улиралд бол хоосон.')
      (New-Field -Id source -Name 'Эх сурвалж' -Type Text -Help 'Зөвлөмжийн эх сурвалж: хамгаалалтын захиргаа, нутгийн иргэд, албан ёсны журам.')
    )
  },
  @{
    id = 'event'; name = 'Арга хэмжээ, баяр наадам (Event)'; displayField = 'title'
    description = 'Баяр наадам, арга хэмжээ (/things-to-do/festivals, /recommendation/<slug>).'
    fields = @(
      (New-Field -Id title -Name 'Гарчиг' -Type Symbol -Required -Help 'Арга хэмжээний нэр. Жишээ: Алтайн бүргэдийн баяр.')
      (New-Field -Id slug -Name 'Slug' -Type Symbol -Required -Unique -Regexp $P -Help $slugHelp)
      (New-Field -Id startDate -Name 'Эхлэх огноо' -Type Date -Help 'Эхлэх өдөр. Жил бүр өөрчлөгддөг бол тухайн жилийн огноог бичнэ.')
      (New-Field -Id endDate -Name 'Дуусах огноо' -Type Date -Help 'Нэг өдрийн арга хэмжээ бол хоосон орхино.')
      (New-Field -Id organizer -Name 'Зохион байгуулагч' -Type Symbol -Help 'Нутгийн зохион байгуулагч: сум, аймаг, холбоо, өрх.')
      (New-Field -Id province -Name 'Аймаг' -Type Symbol -Help $provinceHelp)
      (New-Field -Id culturalMeaning -Name 'Соёлын утга' -Type RichText -Help 'Арга хэмжээний түүх, утга учир.')
      (New-Field -Id howToParticipate -Name 'Зөв оролцох зөвлөмж' -Type Array -ItemsType Symbol -Help 'Жуулчин хэрхэн хүндэтгэлтэй оролцох вэ, зөвлөмж бүрийг тусад нь.')
      (New-Field -Id localServices -Name 'Нутгийн үйлчилгээ' -Type Array -ItemsType Link -ItemsLinkType Entry -LinkContentTypes @('localProvider') -Help 'Арга хэмжээний үеэр байр, хоол, хөтөч санал болгох нутгийн үйлчилгээ үзүүлэгчид.')
      (New-Field -Id bookingUrl -Name 'Захиалгын холбоос' -Type Symbol -Regexp '^https?://' -Help $bookingHelp)
      (New-Field -Id photos -Name 'Зураг' -Type Array -ItemsType Link -ItemsLinkType Asset -Help $photosHelp)
    )
  }
)

function Sync-ContentType($def) {
  $id = $def.id
  $existing = Invoke-Cma -Path "/content_types/$id"
  if ($null -eq $existing) {
    Write-Host "[$id] үүсгэнэ ($($def.fields.Count) талбар)"
    if ($DryRun) { return }
    $body = [ordered]@{
      name = $def.name; description = $def.description; displayField = $def.displayField
      fields = @($def.fields | ForEach-Object { $_.Field })
    }
    $ct = Invoke-Cma -Method PUT -Path "/content_types/$id" -Body $body
    $ct = Invoke-Cma -Method PUT -Path "/content_types/$id/published" -Version $ct.sys.version
  } else {
    $have = @($existing.fields | ForEach-Object { $_.id })
    $missing = @($def.fields | Where-Object { $have -notcontains $_.Field.id })
    if ($missing.Count -eq 0) {
      Write-Host "[$id] байгаа, дутуу талбаргүй"
    } else {
      Write-Host "[$id] байгаа, нэмэх талбар: $(($missing | ForEach-Object { $_.Field.id }) -join ', ')"
      if (-not $DryRun) {
        $fields = @($existing.fields) + @($missing | ForEach-Object { [pscustomobject]$_.Field })
        $body = [ordered]@{
          name = $existing.name; description = $existing.description
          displayField = $existing.displayField; fields = $fields
        }
        $ct = Invoke-Cma -Method PUT -Path "/content_types/$id" -Body $body -Version $existing.sys.version
        $ct = Invoke-Cma -Method PUT -Path "/content_types/$id/published" -Version $ct.sys.version
      }
    }
  }
  if (-not $DryRun) { Sync-HelpText $id $def.fields }
}

# Талбар бүрийн монгол тайлбар, widget. Хүн гараар өөрчилсөн тайлбарыг дарж бичихгүй.
function Sync-HelpText([string]$id, $fields) {
  $ei = Invoke-Cma -Path "/content_types/$id/editor_interface"
  if ($null -eq $ei) { Start-Sleep -Seconds 2; $ei = Invoke-Cma -Path "/content_types/$id/editor_interface" }
  $controls = @($ei.controls)
  $changed = 0
  foreach ($f in $fields) {
    if (-not $f.Help) { continue }
    $c = $controls | Where-Object { $_.fieldId -eq $f.Field.id } | Select-Object -First 1
    if ($null -eq $c) {
      $controls += [pscustomobject]@{ fieldId = $f.Field.id; widgetId = $f.Widget; widgetNamespace = 'builtin'; settings = @{ helpText = $f.Help } }
      $changed++
      continue
    }
    $hasHelp = $c.PSObject.Properties['settings'] -and $c.settings -and $c.settings.PSObject.Properties['helpText'] -and $c.settings.helpText
    if (-not $hasHelp) {
      if (-not $c.PSObject.Properties['settings'] -or -not $c.settings) {
        $c | Add-Member -NotePropertyName settings -NotePropertyValue ([pscustomobject]@{}) -Force
      }
      $c.settings | Add-Member -NotePropertyName helpText -NotePropertyValue $f.Help -Force
      if (-not $c.PSObject.Properties['widgetId'] -or -not $c.widgetId) {
        $c | Add-Member -NotePropertyName widgetId -NotePropertyValue $f.Widget -Force
        $c | Add-Member -NotePropertyName widgetNamespace -NotePropertyValue 'builtin' -Force
      }
      $changed++
    }
  }
  if ($changed -gt 0) {
    Invoke-Cma -Method PUT -Path "/content_types/$id/editor_interface" -Body @{ controls = $controls } -Version $ei.sys.version | Out-Null
    Write-Host "[$id] тайлбар бичсэн: $changed талбар"
  }
}

# Холбоосын шалгалт (linkContentType) нь бусад төрлүүд үүссэний дараа л ажиллах тул
# холбоосгүй төрлүүдийг эхэлж үүсгэнэ.
$order = @('localProvider', 'communityExperience', 'localProduct', 'event', 'visitorGuidance', 'story')
foreach ($id in $order) {
  Sync-ContentType ($types | Where-Object { $_.id -eq $id })
}
Write-Host 'Дууслаа.'
