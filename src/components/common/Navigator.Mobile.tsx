import { Menu } from '@/components/common/Header.client';
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
import { HTMLAttributes } from 'react';
import Link from 'next/link';

interface NavigatorMobileProps extends HTMLAttributes<HTMLDivElement> {
  menus: Menu[];
}

export default function NavigatorMobile({
  menus,
  className,
  ...props
}: NavigatorMobileProps) {
  return (
    <div className={twMerge('block xl:hidden', className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className={twMerge(
              'cursor-pointer size-8 md:size-10',
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
                    <Link href={child.href}>
                      <span className="text-xs md:text-sm">{child.title}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              });
            }

            return (
              <DropdownMenuItem key={menuIndex} asChild>
                <Link href={menu.href}>
                  <span className="text-xs md:text-sm">{menu.title}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
