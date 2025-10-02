import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import linguiConfig from 'lingui.config';

const { locales } = linguiConfig;

function extractLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  const firstSegment = segments[1]; // 첫 번째 세그먼트 (예: /ko/about -> 'ko')

  if (firstSegment && locales.includes(firstSegment)) {
    return firstSegment;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // URL에서 locale 추출
  const urlLocale = extractLocaleFromPath(pathname);

  if (urlLocale) {
    // URL에 locale이 있으면 쿠키에 저장하고 그대로 통과
    const response = NextResponse.next();
    response.cookies.set('locale', urlLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1년
      httpOnly: false, // 클라이언트에서도 접근 가능
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return response;
  }

  // URL에 locale이 없으면 쿠키 → Accept-Language 순으로 locale 결정
  const locale = getLocale(request);

  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('locale')?.value;

  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const langHeader = request.headers.get('accept-language') || undefined;
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(locales.slice());

  const activeLocale = languages[0] || locales[0] || 'en';

  return activeLocale;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|manifest.*.json|sitemap.*.xml|robots.*.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
