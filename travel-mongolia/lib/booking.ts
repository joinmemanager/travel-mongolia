// Content-to-Booking (C12): joinme.mn руу очих холбоос бүр контентын төрөл, slug-ийг UTM-ээр дамжуулна.
//   utm_source=travelhubmongolia, utm_medium=referral,
//   utm_campaign=<контентын төрөл>, utm_content=<slug>
// Үйлчилгээ үзүүлэгчийн өөрийн сайт руу (joinme биш) холбоосыг өөрчлөхгүй.

export const JOINME_URL = 'https://joinme.mn';

export type BookingCampaign =
  | 'destination'
  | 'heritage'
  | 'province'
  | 'provider'
  | 'experience'
  | 'event'
  | 'story'
  | 'route';

function withUtm(url: URL, campaign: string, content: string): string {
  url.searchParams.set('utm_source', 'travelhubmongolia');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
}

export function joinmeUrl(campaign: BookingCampaign, content: string): string {
  return withUtm(new URL(JOINME_URL), campaign, content);
}

// Entry-ийн bookingUrl: хоосон бол joinme.mn, joinme.mn бол UTM нэмнэ, бусад нь хэвээр
export function bookingHref(url: string | undefined, campaign: BookingCampaign, content: string): string {
  if (!url) return joinmeUrl(campaign, content);
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'joinme.mn' || parsed.hostname.endsWith('.joinme.mn')) {
      return withUtm(parsed, campaign, content);
    }
    return url;
  } catch {
    return joinmeUrl(campaign, content);
  }
}

export const isJoinmeUrl = (href: string) => {
  try {
    const h = new URL(href).hostname;
    return h === 'joinme.mn' || h.endsWith('.joinme.mn');
  } catch {
    return false;
  }
};
