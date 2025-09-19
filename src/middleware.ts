import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import linguiConfig from 'lingui.config';

const { locales } = linguiConfig;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some((locale) => {
    const localePattern = new RegExp(`^/${locale}(/.*)?$`);

    return localePattern.test(pathname);
  });

  if (pathnameHasLocale) return;

  const locale = getLocale(request.headers);

  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

function getLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined;
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(locales.slice());

  const activeLocale = languages[0] || locales[0] || 'en';

  return activeLocale;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.*.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
