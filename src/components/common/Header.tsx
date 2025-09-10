import { HTMLAttributes } from 'react';
import HeaderWeb from 'src/components/common/Header.Web';
import HeaderMobile from 'src/components/common/Header.Mobile';

export default function Header(props: HTMLAttributes<HTMLHeadElement>) {
  return (
    <>
      <HeaderWeb {...props} />
      <HeaderMobile {...props} />
    </>
  );
}
