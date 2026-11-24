// Next 16 proxy (хуучин middleware): зөвхөн /admin-д. payload-totp-ийн admin provider одоогийн замыг серверт
// мэдэхийн тулд `x-pathname` request header хэрэгтэй (эс бөгөөс 2FA хуудас руу үүрд redirect хийнэ).
// Хэрэглэгчийн илгээсэн x-pathname-ийг дарж бичнэ. Сайтын хуудсуудад огт ажиллахгүй (matcher).
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-pathname', request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
