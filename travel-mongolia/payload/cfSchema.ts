// ҮҮСГЭСЭН ФАЙЛ: scripts/payload/generate-schema.js (Contentful-ийн content type-уудаас, contentful-export-2026-11-12).
// Payload-ийн collection-ууд (payload/collections.ts), импорт (scripts/payload/import.ts) болон
// Contentful хэлбэрийн өгөгдлийн давхарга (lib/cms/payloadSource.ts) энэ нэг схемийг ашиглана.
// Гараар засаж болно; дахин үүсгэвэл засвар дарагдана.

export type CfFieldKind =
  | 'text'
  | 'textarea'
  | 'richText'
  | 'number'
  | 'checkbox'
  | 'date'
  | 'location'
  | 'json'
  | 'select'
  | 'upload'
  | 'relationship';

export interface CfField {
  id: string;
  name: string;
  kind: CfFieldKind;
  localized: boolean;
  required: boolean;
  unique?: boolean;
  maxLength?: number;
  hasMany?: boolean;
  integer?: boolean;
  options?: string[];
  relationTo?: string[];
}

export interface CfType {
  name: string;
  displayField: string;
  fields: CfField[];
}

export const CF_SCHEMA: Record<string, CfType> = {
  "communityExperience": {
    "name": "Нутгийн туршлага (Community Experience)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Гарчиг",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "host",
        "name": "Зохион байгуулагч",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "relationTo": [
          "localProvider"
        ]
      },
      {
        "id": "community",
        "name": "Нутгийн оролцоо",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "province",
        "name": "Аймаг",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "duration",
        "name": "Хугацаа",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "groupSize",
        "name": "Бүлгийн хэмжээ",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "whatYouDo",
        "name": "Юу хийх, мэдрэх вэ",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "culturalGuidance",
        "name": "Соёлын зөв харилцаа",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "price",
        "name": "Үнэ",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "season",
        "name": "Улирал",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "bookingUrl",
        "name": "Захиалгын холбоос",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "photos",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload",
        "hasMany": true
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      }
    ]
  },
  "cultureArticle": {
    "name": "Соёл, түүхийн нийтлэл (cultureArticle)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Гарчиг",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "kind": "text"
      },
      {
        "id": "section",
        "name": "Хэсэг",
        "localized": false,
        "required": true,
        "kind": "select",
        "options": [
          "ethnic-groups",
          "people",
          "religion",
          "traditions"
        ]
      },
      {
        "id": "order",
        "name": "Дараалал",
        "localized": false,
        "required": false,
        "kind": "number",
        "integer": true
      },
      {
        "id": "image",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "body",
        "name": "Нийтлэл",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "maxLength": 60,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "maxLength": 160,
        "kind": "textarea"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      }
    ]
  },
  "cultureHeritage": {
    "name": "Culture & Heritage",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "title",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "subtitle",
        "name": "subtitle",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "date",
        "name": "date",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "tag",
        "name": "tag",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "image",
        "name": "image",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "description",
        "name": "description",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "order",
        "name": "order",
        "localized": false,
        "required": false,
        "kind": "number",
        "integer": true
      }
    ]
  },
  "destination": {
    "name": "Destination",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Title",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "description",
        "name": "Description",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "mapCoordinates",
        "name": "Map coordinates",
        "localized": false,
        "required": false,
        "kind": "location"
      },
      {
        "id": "coverImage",
        "name": "Cover Image",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "temperature",
        "name": "Temperature",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "weather",
        "name": "Weather",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "subtitle",
        "name": "subtitle",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "slug",
        "localized": false,
        "required": false,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "province",
        "name": "Аймаг",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "heritageFeatures",
        "name": "Өв, байгалийн онцлог",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "localPeople",
        "name": "Нутгийн хүмүүс",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "relatedExperience",
        "name": "Холбоотой туршлага",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "communityExperience"
        ]
      },
      {
        "id": "relatedProvider",
        "name": "Нутгийн үйлчилгээ (байр, хоол, хөтөч)",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProvider"
        ]
      },
      {
        "id": "relatedProduct",
        "name": "Нутгийн бүтээгдэхүүн",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProduct"
        ]
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "intro",
        "name": "Товч танилцуулга",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "whyVisit",
        "name": "Яагаад очих вэ",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "attractions",
        "name": "Үзмэрүүд",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "thingsToDo",
        "name": "Юу хийх вэ",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "bestTimeToVisit",
        "name": "Хэзээ очих (улирал)",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "suggestedDuration",
        "name": "Хэдэн хоног",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "gettingThere",
        "name": "Хэрхэн очих",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "whereToStay",
        "name": "Хаана буудаллах",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "suggestedItineraries",
        "name": "Санал болгох маршрут",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "faq",
        "name": "Асуулт-хариулт (FAQ)",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "faqItem"
        ]
      },
      {
        "id": "sources",
        "name": "Эх сурвалж",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "reviewedBy",
        "name": "Хянасан (нутгийн мэргэжилтэн)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "lastUpdated",
        "name": "Сүүлд шинэчилсэн",
        "localized": false,
        "required": false,
        "kind": "date"
      },
      {
        "id": "provinceRef",
        "name": "Харьяалах аймаг (холбоос)",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "relationTo": [
          "province"
        ]
      },
      {
        "id": "protectedCategory",
        "name": "Тусгай хамгаалалтын ангилал",
        "localized": false,
        "required": false,
        "kind": "select",
        "options": [
          "strictly-protected",
          "national-park",
          "nature-reserve",
          "natural-monument"
        ]
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      }
    ]
  },
  "event": {
    "name": "Арга хэмжээ, баяр наадам (Event)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Гарчиг",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "startDate",
        "name": "Эхлэх огноо",
        "localized": false,
        "required": false,
        "kind": "date"
      },
      {
        "id": "endDate",
        "name": "Дуусах огноо",
        "localized": false,
        "required": false,
        "kind": "date"
      },
      {
        "id": "organizer",
        "name": "Зохион байгуулагч",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "province",
        "name": "Аймаг",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "culturalMeaning",
        "name": "Соёлын утга",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "howToParticipate",
        "name": "Зөв оролцох зөвлөмж",
        "localized": true,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "localServices",
        "name": "Нутгийн үйлчилгээ",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProvider"
        ]
      },
      {
        "id": "bookingUrl",
        "name": "Захиалгын холбоос",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "photos",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload",
        "hasMany": true
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "needsVerification",
        "name": "TIC-ээс авсан, шалгах (утас, үнэ, огноо)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "dateText",
        "name": "Огноо (TIC-ийн бичвэрээр)",
        "localized": false,
        "required": false,
        "kind": "text"
      }
    ]
  },
  "faqItem": {
    "name": "Асуулт-хариулт (FAQ)",
    "displayField": "question",
    "fields": [
      {
        "id": "question",
        "name": "Асуулт",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "answer",
        "name": "Хариулт",
        "localized": true,
        "required": true,
        "kind": "textarea"
      }
    ]
  },
  "heritageCategory": {
    "name": "Heritage Category",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "title",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "slug",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "count",
        "name": "count",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "remainingCount",
        "name": "remainingCount",
        "localized": false,
        "required": false,
        "kind": "number",
        "integer": true
      },
      {
        "id": "places",
        "name": "places",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "heritagePlace"
        ]
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      }
    ]
  },
  "heritagePlace": {
    "name": "Heritage Place",
    "displayField": "name",
    "fields": [
      {
        "id": "name",
        "name": "name",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "region",
        "name": "region",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "image",
        "name": "image",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "description",
        "name": "description",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "coordinates",
        "name": "coordinates",
        "localized": false,
        "required": false,
        "kind": "location"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": false,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "province",
        "name": "Аймаг",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "heritageFeatures",
        "name": "Өв, байгалийн онцлог",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "localPeople",
        "name": "Нутгийн хүмүүс",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "relatedExperience",
        "name": "Холбоотой туршлага",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "communityExperience"
        ]
      },
      {
        "id": "relatedProvider",
        "name": "Нутгийн үйлчилгээ (байр, хоол, хөтөч)",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProvider"
        ]
      },
      {
        "id": "relatedProduct",
        "name": "Нутгийн бүтээгдэхүүн",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProduct"
        ]
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "provinceRef",
        "name": "Харьяалах аймаг (холбоос)",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "relationTo": [
          "province"
        ]
      },
      {
        "id": "protectedCategory",
        "name": "Тусгай хамгаалалтын ангилал",
        "localized": false,
        "required": false,
        "kind": "select",
        "options": [
          "strictly-protected",
          "national-park",
          "nature-reserve",
          "natural-monument"
        ]
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      }
    ]
  },
  "historyArticle": {
    "name": "Түүхийн нийтлэл (historyArticle)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Гарчиг",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "period",
        "name": "Үе (түүхийн хуудасны хэсэг)",
        "localized": false,
        "required": true,
        "kind": "select",
        "options": [
          "ancient-land",
          "hunnu-empires",
          "great-mongol",
          "mongol-empire",
          "xvii-xix-century",
          "xx-century",
          "modern-mongolia",
          "themes"
        ]
      },
      {
        "id": "order",
        "name": "Үе доторх дараалал",
        "localized": false,
        "required": false,
        "kind": "number",
        "integer": true
      },
      {
        "id": "image",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "body",
        "name": "Нийтлэл",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "maxLength": 60,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "maxLength": 160,
        "kind": "textarea"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "reviewedBy",
        "name": "Шалгасан",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "lastUpdated",
        "name": "Сүүлд шинэчилсэн",
        "localized": false,
        "required": false,
        "kind": "date"
      }
    ]
  },
  "localProduct": {
    "name": "Нутгийн бүтээгдэхүүн (Local Product)",
    "displayField": "name",
    "fields": [
      {
        "id": "name",
        "name": "Нэр",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "producer",
        "name": "Үйлдвэрлэгч",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "relationTo": [
          "localProvider"
        ]
      },
      {
        "id": "origin",
        "name": "Гарал үүсэл",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "story",
        "name": "Бүтээгдэхүүний түүх",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "season",
        "name": "Улирал",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "whereToBuy",
        "name": "Хаанаас авах",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "relatedExperience",
        "name": "Холбоотой туршлага",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "communityExperience"
        ]
      },
      {
        "id": "photos",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload",
        "hasMany": true
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      }
    ]
  },
  "localProvider": {
    "name": "Нутгийн үйлчилгээ үзүүлэгч (Local Provider)",
    "displayField": "name",
    "fields": [
      {
        "id": "name",
        "name": "Нэр",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "providerType",
        "name": "Төрөл",
        "localized": false,
        "required": true,
        "kind": "select",
        "options": [
          "herder-family",
          "guide",
          "artisan",
          "food",
          "small-business",
          "accommodation",
          "tour"
        ]
      },
      {
        "id": "province",
        "name": "Аймаг",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "location",
        "name": "Байршил (газрын зураг)",
        "localized": false,
        "required": false,
        "kind": "location"
      },
      {
        "id": "story",
        "name": "Хэн бэ (түүх)",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "services",
        "name": "Үйлчилгээ",
        "localized": true,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "priceFrom",
        "name": "Үнэ (-аас эхлэн)",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "bookingUrl",
        "name": "Захиалгын холбоос",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "contact",
        "name": "Холбоо барих",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "localOwned",
        "name": "Нутгийн өмчлөлтэй",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "communityParticipation",
        "name": "Нутгийн оролцоо",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "responsiblePractices",
        "name": "Хариуцлагатай дадал",
        "localized": true,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "recognizedCertification",
        "name": "Хүлээн зөвшөөрөгдсөн гэрчилгээ",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "licenseIfRequired",
        "name": "Тусгай зөвшөөрөл",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "womenOrYouthLed",
        "name": "Эмэгтэйчүүд / залуучууд удирддаг",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "photos",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload",
        "hasMany": true
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "needsVerification",
        "name": "TIC-ээс авсан, шалгах (утас, үнэ, огноо)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "phones",
        "name": "Утас",
        "localized": false,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "soum",
        "name": "Сум",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "locationText",
        "name": "Байршил (текст)",
        "localized": false,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "externalImages",
        "name": "Зургийн гадаад холбоос",
        "localized": false,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "joinmeCategory",
        "name": "joinme ангилал (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "joinmeId",
        "name": "joinme id (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "joinmeUrl",
        "name": "joinme эх хуудас (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      }
    ]
  },
  "place": {
    "name": "Газар (place)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Нэр",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "category",
        "name": "Ангилал",
        "localized": false,
        "required": true,
        "kind": "select",
        "options": [
          "strictly-protected",
          "national-park",
          "nature-reserve",
          "natural-monument",
          "museum",
          "theatre",
          "culture-center",
          "sanatorium",
          "landscape"
        ]
      },
      {
        "id": "province",
        "name": "Харьяалах аймаг",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "relationTo": [
          "province"
        ]
      },
      {
        "id": "soum",
        "name": "Сум, дүүрэг",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "image",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "body",
        "name": "Танилцуулга",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "maxLength": 60,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "maxLength": 160,
        "kind": "textarea"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "reviewedBy",
        "name": "Шалгасан",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "lastUpdated",
        "name": "Сүүлд шинэчилсэн",
        "localized": false,
        "required": false,
        "kind": "date"
      }
    ]
  },
  "province": {
    "name": "Province",
    "displayField": "slug",
    "fields": [
      {
        "id": "slug",
        "name": "slug",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "title",
        "name": "title",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "image",
        "name": "image",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "center",
        "name": "center",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "population",
        "name": "population",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "area",
        "name": "area",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "highlights",
        "name": "highlights",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "description2",
        "name": "description2",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "heritageFeatures",
        "name": "Өв, байгалийн онцлог",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "localPeople",
        "name": "Нутгийн хүмүүс",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "relatedExperience",
        "name": "Холбоотой туршлага",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "communityExperience"
        ]
      },
      {
        "id": "relatedProvider",
        "name": "Нутгийн үйлчилгээ (байр, хоол, хөтөч)",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProvider"
        ]
      },
      {
        "id": "relatedProduct",
        "name": "Нутгийн бүтээгдэхүүн",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProduct"
        ]
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "intro",
        "name": "Товч танилцуулга",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "whyVisit",
        "name": "Яагаад очих вэ",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "attractions",
        "name": "Үзмэрүүд",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "thingsToDo",
        "name": "Юу хийх вэ",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "bestTimeToVisit",
        "name": "Хэзээ очих (улирал)",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "suggestedDuration",
        "name": "Хэдэн хоног",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "gettingThere",
        "name": "Хэрхэн очих",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "whereToStay",
        "name": "Хаана буудаллах",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "suggestedItineraries",
        "name": "Санал болгох маршрут",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "faq",
        "name": "Асуулт-хариулт (FAQ)",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "faqItem"
        ]
      },
      {
        "id": "sources",
        "name": "Эх сурвалж",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "reviewedBy",
        "name": "Хянасан (нутгийн мэргэжилтэн)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "lastUpdated",
        "name": "Сүүлд шинэчилсэн",
        "localized": false,
        "required": false,
        "kind": "date"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "emblem",
        "name": "Сүлд (hero дээрх тэмдэг)",
        "localized": false,
        "required": false,
        "kind": "upload"
      }
    ]
  },
  "recommendation": {
    "name": "Recommendation",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Title",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "season",
        "name": "season",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "image",
        "name": "Image",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "linkUrl",
        "name": "LinkUrl",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "isFeatured",
        "name": "isFeatured",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": false,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      }
    ]
  },
  "soum": {
    "name": "Сум (soum)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Нэр",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "kind": "text"
      },
      {
        "id": "province",
        "name": "Аймаг",
        "localized": false,
        "required": true,
        "kind": "relationship",
        "relationTo": [
          "province"
        ]
      },
      {
        "id": "ownPage",
        "name": "Тусдаа хуудастай",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "image",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "center",
        "name": "Сумын төв",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "population",
        "name": "Хүн ам",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "area",
        "name": "Нутаг дэвсгэр",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "body",
        "name": "Танилцуулга",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "maxLength": 60,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "maxLength": 160,
        "kind": "textarea"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "reviewedBy",
        "name": "Шалгасан",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "lastUpdated",
        "name": "Сүүлд шинэчилсэн",
        "localized": false,
        "required": false,
        "kind": "date"
      }
    ]
  },
  "species": {
    "name": "Амьтан, ургамал (species)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Монгол нэр",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "latinName",
        "name": "Латин нэр",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "group",
        "name": "Бүлэг",
        "localized": false,
        "required": true,
        "kind": "select",
        "options": [
          "mammal",
          "bird",
          "reptile",
          "fish",
          "invertebrate",
          "plant"
        ]
      },
      {
        "id": "ownPage",
        "name": "Тусдаа хуудастай",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "order",
        "name": "Дараалал (TIC жагсаалтын)",
        "localized": false,
        "required": false,
        "kind": "number",
        "integer": true
      },
      {
        "id": "image",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "summary",
        "name": "Товч тайлбар (каталог)",
        "localized": true,
        "required": false,
        "maxLength": 600,
        "kind": "textarea"
      },
      {
        "id": "body",
        "name": "Нийтлэл",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "maxLength": 60,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "maxLength": 160,
        "kind": "textarea"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "reviewedBy",
        "name": "Шалгасан",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "lastUpdated",
        "name": "Сүүлд шинэчилсэн",
        "localized": false,
        "required": false,
        "kind": "date"
      }
    ]
  },
  "story": {
    "name": "Нийтлэл, түүх (Story)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Гарчиг",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "slug",
        "name": "Slug",
        "localized": false,
        "required": true,
        "unique": true,
        "kind": "text"
      },
      {
        "id": "topic",
        "name": "Сэдэв",
        "localized": false,
        "required": true,
        "kind": "select",
        "options": [
          "culture",
          "nature",
          "nomadic",
          "food",
          "people",
          "photo-video",
          "news",
          "international",
          "local",
          "respect",
          "impact"
        ]
      },
      {
        "id": "body",
        "name": "Агуулга",
        "localized": true,
        "required": false,
        "kind": "richText"
      },
      {
        "id": "media",
        "name": "Зураг",
        "localized": false,
        "required": false,
        "kind": "upload",
        "hasMany": true
      },
      {
        "id": "videoUrl",
        "name": "Видео холбоос",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "location",
        "name": "Байршил",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "relatedPlace",
        "name": "Холбоотой газар",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "destination",
          "heritagePlace",
          "province"
        ]
      },
      {
        "id": "relatedExperience",
        "name": "Холбоотой туршлага",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "communityExperience"
        ]
      },
      {
        "id": "relatedProduct",
        "name": "Холбоотой бүтээгдэхүүн",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "hasMany": true,
        "relationTo": [
          "localProduct"
        ]
      },
      {
        "id": "source",
        "name": "Эх сурвалж",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "storyteller",
        "name": "Ярилцагч / өгүүлэгч",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "editor",
        "name": "Хариуцсан редактор",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "consentObtained",
        "name": "Зөвшөөрөл авсан",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "language",
        "name": "Хэл",
        "localized": false,
        "required": false,
        "kind": "select",
        "options": [
          "mn",
          "en",
          "zh"
        ]
      },
      {
        "id": "updatedDate",
        "name": "Шинэчилсэн огноо",
        "localized": false,
        "required": false,
        "kind": "date"
      },
      {
        "id": "seoTitle",
        "name": "SEO гарчиг",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "seoDescription",
        "name": "SEO тайлбар",
        "localized": true,
        "required": false,
        "kind": "textarea"
      },
      {
        "id": "ogImage",
        "name": "Хуваалцах зураг (OG)",
        "localized": false,
        "required": false,
        "kind": "upload"
      },
      {
        "id": "sourceUrl",
        "name": "TIC эх URL (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "needsReplacement",
        "name": "Солих шаардлагатай (сайтад харагдахгүй)",
        "localized": false,
        "required": false,
        "kind": "checkbox"
      },
      {
        "id": "publishedDate",
        "name": "Анх нийтэлсэн огноо (TIC)",
        "localized": false,
        "required": false,
        "kind": "date"
      },
      {
        "id": "originalUrl",
        "name": "Эх тайлангийн холбоос",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "publisher",
        "name": "Хэвлэгч",
        "localized": false,
        "required": false,
        "kind": "text"
      },
      {
        "id": "year",
        "name": "Он",
        "localized": false,
        "required": false,
        "kind": "number",
        "integer": true
      },
      {
        "id": "sourceType",
        "name": "Эх тайлангийн төрөл",
        "localized": false,
        "required": false,
        "kind": "select",
        "options": [
          "standard",
          "policy",
          "research",
          "statistics",
          "company-report"
        ]
      }
    ]
  },
  "visitorGuidance": {
    "name": "Аялагчийн зөвлөмж (Visitor Guidance)",
    "displayField": "title",
    "fields": [
      {
        "id": "title",
        "name": "Гарчиг (дотоод)",
        "localized": true,
        "required": true,
        "kind": "text"
      },
      {
        "id": "place",
        "name": "Газар",
        "localized": false,
        "required": false,
        "kind": "relationship",
        "relationTo": [
          "destination",
          "heritagePlace",
          "province"
        ]
      },
      {
        "id": "culturalEtiquette",
        "name": "Соёлын ёс",
        "localized": true,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "natureGuidance",
        "name": "Байгаль хамгаалал",
        "localized": true,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "safety",
        "name": "Аюулгүй байдал",
        "localized": true,
        "required": false,
        "kind": "text",
        "hasMany": true
      },
      {
        "id": "season",
        "name": "Улирал",
        "localized": true,
        "required": false,
        "kind": "text"
      },
      {
        "id": "source",
        "name": "Эх сурвалж",
        "localized": true,
        "required": false,
        "kind": "textarea"
      }
    ]
  }
};
