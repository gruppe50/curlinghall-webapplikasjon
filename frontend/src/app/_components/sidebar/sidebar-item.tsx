'use client';
import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebarContext } from '@/_lib/context/sidebar-context';
import { useSubMenuContext } from '@/_lib/context/submenu-context';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

export type SidebarItemType = {
  name: string;
  path: string;
  icon: JSX.Element;
  items?: SubItemType[];
}
type SubItemType = {
  name: string;
  path: string;
}

const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();      // Prevent default behavior of space and enter keys
    event.currentTarget.click(); // Trigger a click event on the focused sidebar item
  }
};

const SidebarItem: React.FC<SidebarItemType>= ({ name, path, icon, items }) => {
  const { collapsed, setCollapsed } = useSidebarContext();
  const { collapsedSubMenu, setCollapsedSubMenu } = useSubMenuContext();
  const router = useRouter();
  const pathname = usePathname();
  
  const handleClick = () => {
    if (items && items.length > 0) {
      setCollapsed(false);
      collapsed 
        ? setCollapsedSubMenu(false)
        : setCollapsedSubMenu(!collapsedSubMenu);
      return;
    }
    return router.push(path);
  };

  const isActive = useMemo(() => {
    /*
    if (items && items.length > 0) {
      if (items.find((item) => item.path === pathname)) {
        setCollapsed(false);
        return true;
      }
    }
    return path === pathname;
    */
    return pathname.startsWith(path);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <li className="my-1">
        <div className={`sidebaritem group
          ${!collapsed && items && items.length > 0 
            ? (collapsedSubMenu && isActive
              ? "sidebaritem-active"
              : ""
              )
            : (isActive
                ? "sidebaritem-active"
                : "sidebaritem-inactive"
              )
            }
          `}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
        <div className="flex items-center ml-[5px]">
          {icon}
        </div>
        <span
          className={`flex items-center justify-between overflow-hidden transition-all ${
            !collapsed ? "w-full ml-3" : "w-0"
          }`}
        >
          <span>{name}</span>
          {items && items.length > 0 && <span className="flex items-center">
            {
              collapsedSubMenu
              ? <MdKeyboardArrowDown size={18} className="ml-1" />
              : <MdKeyboardArrowUp size={18} className="ml-1" />
            }
          </span>}
        </span>
        
        {collapsed && (
          <div
            className={"sidebar-label"}
          >
            {name}
          </div>
        )}
        </div>
        
        {!collapsed && items && items.length > 0 && (
          <div className={`
            flex flex-col w-auto mx-[-12px] transition-all duration-100 bg-slate-100
            ${collapsedSubMenu ? "h-0 py-0" : "py-1"}`}
          >
            {items.map((item) => (
              <span className={`
                ml-12 pr-3 whitespace-nowrap overflow-hidden transition-all duration-100
                ${collapsedSubMenu ? "h-0" : ""}`}
                key={item.path}
              >
                <SubItem item={item} />
              </span>
            ))}
          </div>
        )}
      </li>
  );
};

const SubItem = ({ item }: { item: SubItemType }) => {
  const { name, path } = item;
  const router = useRouter();
  const pathname = usePathname();

  const { collapsedSubMenu } = useSubMenuContext();

  const handleClick = () => {
    router.push(path);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActive = useMemo(() => path === pathname, [pathname]);

  return (
    <div
      className={`
        relative flex items-center py-2 px-2 my-1 ml-1 
        font-medium rounded-md cursor-pointer transition-colors 
      ${
        isActive 
          ? "sidebaritem-active" 
          : "sidebaritem-inactive text-gray-600"
        }
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={collapsedSubMenu ? undefined : 0}
    >
      {name}
    </div>
  );
};

export default SidebarItem;