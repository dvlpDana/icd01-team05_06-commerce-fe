'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MainMenu } from '@/types/menu-types';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { logout } from '@/app/actions/auth-action';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/use-user-store';
import { ShoppingCartIcon } from 'lucide-react';

interface HamburgerMenuProps {
  mainMenu: MainMenu[];
}

const myPageMenu = [
  { title: '주문내역/배송조회', route: '/me/orders' },
  { title: '회원정보관리', route: '/me/user-info' },
  { title: '나의 리뷰', route: '/me/reviews' },
];

const HamburgerMenu = ({ mainMenu }: HamburgerMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Use searchParams to preserve existing queries
  const { isLoggedIn, resetAuthState } = useAuthStore();
  const { resetUserState } = useUserStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  useEffect(() => {
    closeMenu(); // Close the menu on route change
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();

      resetAuthState();
      resetUserState();

      router.push('/');

      closeMenu();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveCategory(null);
    setActiveItem(null);
  };

  const toggleCategory = (index: number, type?: string) => {
    if (type) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('type', type); // Set new type while preserving existing params

      closeMenu();
      router.push(`${pathname}?${params.toString()}`);
    } else {
      if (activeCategory === index) {
        setActiveCategory(null);
        setActiveItem(null);
      } else {
        setActiveCategory(index);
        setActiveItem(null); // Reset active item when switching categories
      }
    }
  };

  const toggleItem = (index: number) => {
    if (activeItem === index) {
      setActiveItem(null);
    } else {
      setActiveItem(index);
    }
  };

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <div className="flex items-center gap-x-5">
        <Link href="/cart">
          <ShoppingCartIcon size={25} />
        </Link>
        <button
          className="flex size-8 flex-col items-center justify-center space-y-1 border-none bg-transparent focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-current transition-transform${
              isOpen ? ' translate-y-1.5 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-opacity ${
              isOpen ? ' opacity-0' : ' opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-transform${
              isOpen ? ' -translate-y-1.5 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 top-14 z-50 flex w-full max-w-[100vw] flex-col overflow-y-auto border-t bg-white">
          <div className="flex justify-center space-x-5 px-8 pb-4 pt-8">
            {isLoggedIn ? (
              <>
                <Button variant={'outline'} onClick={handleLogout}>
                  로그아웃
                </Button>
                <Button asChild>
                  <Link href={'/me'}>마이페이지</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="max-w-40 flex-1 rounded-full">
                  <Link href={'/login'}>로그인</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary max-w-40 flex-1 rounded-full"
                >
                  <Link href={'/signup'}>회원가입</Link>
                </Button>
              </>
            )}
          </div>

          <ul className="flex w-full flex-col space-y-2 px-4">
            {mainMenu.map((menu, index) => (
              <li key={index}>
                <div>
                  <button
                    className="w-full rounded-md p-2 text-left text-slate-700 hover:bg-slate-100"
                    onClick={() => toggleCategory(index, menu.type)}
                  >
                    {menu.title}
                  </button>
                  {menu.categories && activeCategory === index && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {menu.categories.map((category, categoryIndex) => (
                        <li key={categoryIndex}>
                          <div>
                            <button
                              className="w-full rounded-md p-2 text-left text-slate-600 hover:bg-slate-200"
                              onClick={() => toggleItem(categoryIndex)}
                            >
                              {category.title}
                            </button>
                            {category.items && activeItem === categoryIndex && (
                              <ul className="ml-4 mt-2 space-y-2">
                                {category.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={{
                                        pathname: '/search',
                                        query: {
                                          ...Object.fromEntries(searchParams.entries()), // Preserve existing params
                                          category: item.id?.toString() ?? '',
                                        },
                                      }}
                                      onClick={closeMenu}
                                    >
                                      <span className="block rounded-md p-2 font-light text-slate-600 hover:bg-slate-200">
                                        {item.title}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* 새로운 MyPage 메뉴 섹션 (로그인 상태일 때만 표시) */}
          {isLoggedIn && (
            <div className="mx-4 mt-4 border-t pt-4">
              <h3 className="font-semibold text-slate-700">마이페이지</h3>
              <ul className="mt-2 flex flex-col space-y-2">
                {myPageMenu.map((menu, index) => (
                  <li key={index}>
                    <Link href={menu.route} onClick={closeMenu}>
                      <span className="block rounded-md p-2 text-slate-600 hover:bg-slate-200">
                        {menu.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
