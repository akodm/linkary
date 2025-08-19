import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';

const LOCALES = ['en', 'ko', 'cn', 'jp', 'es'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`,
  );

  console.log(pathnameHasLocale, pathname);

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request.headers);

  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

function getLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined;
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(LOCALES.slice());

  const activeLocale = languages[0] || LOCALES[0] || 'en';

  return activeLocale;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
