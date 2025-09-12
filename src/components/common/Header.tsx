import HeaderWeb, { HeaderWebProps } from 'src/components/common/Header.Web';
import HeaderMobile, {
  HeaderMobileProps,
} from 'src/components/common/Header.Mobile';

export default function Header(props: HeaderWebProps | HeaderMobileProps) {
  return (
    <>
      <HeaderWeb {...(props as HeaderWebProps)} />
      <HeaderMobile {...(props as HeaderMobileProps)} />
    </>
  );
}
