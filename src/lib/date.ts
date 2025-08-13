import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// 지원 언어 플러그인
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

// 지원 언어 타입
export type Locale = 'ko' | 'ja' | 'en' | 'zh-cn' | 'es';
// 지원 시간대 타입
export type Timezone =
  | 'Asia/Seoul'
  | 'Asia/Tokyo'
  | 'America/Los_Angeles'
  | 'Asia/Shanghai'
  | 'Europe/Madrid';

// 언어 타입에 따른 시간대 매핑
export const LOCALE_TO_TZ: Record<Locale, Timezone> = {
  ko: 'Asia/Seoul',
  ja: 'Asia/Tokyo',
  en: 'America/Los_Angeles',
  'zh-cn': 'Asia/Shanghai',
  es: 'Europe/Madrid',
};

// 현재 UTC 시간 반환
export function utcNow() {
  return new Date().toISOString();
}

// 지역 시간을 UTC 시간으로 변환 (데이터용)
export function localToUtc(
  date: string,
  locale: Locale,
  format = 'YYYY-MM-DD HH:mm',
) {
  const tz = LOCALE_TO_TZ[locale];
  const d = dayjs.tz(date, format, tz);

  if (!d.isValid()) {
    return null;
  }

  return d.toISOString();
}

// UTC 시간대를 지역 시간 형식으로 변환 (클라이언트 표시)
export function utcToLocal(
  date: string | Date,
  locale: Locale,
  format = 'LLL',
) {
  const tz = LOCALE_TO_TZ[locale];
  const d = dayjs.utc(date).tz(tz).locale(locale);

  if (!d.isValid()) {
    return null;
  }

  return d.format(format);
}
