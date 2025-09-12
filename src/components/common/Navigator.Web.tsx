import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from 'src/components/ui/navigation-menu';
import I18nLink from 'src/components/common/I18nLink';
import { Menu } from 'src/components/common/Header';

export default function NavigatorWeb({ menus }: { menus: Menu[] }) {
  return (
    <div className="hidden xl:block mx-auto">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {menus.map((menu) => {
            return (
              <NavigationMenuItem key={menu.title}>
                {menu.href ? (
                  <NavigationMenuLink asChild>
                    <I18nLink href={menu.href}>{menu.title}</I18nLink>
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuTrigger className="bg-transparent cursor-pointer">
                    {menu.title}
                  </NavigationMenuTrigger>
                )}
                {menu.children && (
                  <NavigationMenuContent>
                    <ul className="grid gap-4 min-w-60">
                      <li>
                        {menu.children.map((child) => {
                          return (
                            <NavigationMenuLink asChild key={child.title}>
                              <I18nLink href={child.href}>
                                <p className="text-sm font-medium">
                                  {child.title}
                                </p>
                                <p className="text-xs">{child.description}</p>
                              </I18nLink>
                            </NavigationMenuLink>
                          );
                        })}
                      </li>
                    </ul>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
