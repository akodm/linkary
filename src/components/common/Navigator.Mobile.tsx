import { Menu } from 'src/components/common/Header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { colorPresets } from '@/css/colors';
import I18nLink from 'src/components/common/I18nLink';

export default function NavigatorMobile({ menus }: { menus: Menu[] }) {
  return (
    <div className="block xl:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className={twMerge(
              'cursor-pointer',
              colorPresets({ preset: 'gray-light' }),
            )}
          >
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menus.map((menu, menuIndex) => {
            if (menu.children) {
              return menu.children.map((child, childIndex) => {
                return (
                  <DropdownMenuItem key={childIndex} asChild>
                    <I18nLink href={child.href}>
                      <span className="text-xs md:text-sm">{child.title}</span>
                    </I18nLink>
                  </DropdownMenuItem>
                );
              });
            }

            return (
              <DropdownMenuItem key={menuIndex} asChild>
                <I18nLink href={menu.href}>
                  <span className="text-xs md:text-sm">{menu.title}</span>
                </I18nLink>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
