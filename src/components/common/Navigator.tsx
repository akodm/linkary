import { Menu } from 'src/components/common/Header';
import NavigatorMobile from 'src/components/common/Navigator.Mobile';
import NavigatorWeb from 'src/components/common/Navigator.Web';

export default function Navigator({ menus }: { menus: Menu[] }) {
  return (
    <>
      <NavigatorWeb menus={menus} />
      <NavigatorMobile menus={menus} />
    </>
  );
}
