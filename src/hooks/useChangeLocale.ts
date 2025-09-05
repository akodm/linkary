export default function useChangeLocale() {
  const onChangeLocale = (locale: string) => {
    const href = window.location.href;
    const pathname = href.split('/')[1];
    const newHref = `/${locale}${pathname}`;

    window.location.href = newHref;
  };

  return {
    onChangeLocale,
  };
}
