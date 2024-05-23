import React from 'react';

import { SidebarContextProvider } from '@/_lib/context/sidebar-context';
import { SubMenuContextProvider } from '@/_lib/context/submenu-context';
import SidebarLayout from '@/_components/sidebar/sidebar-layout';
import SidebarItem from '@/_components/sidebar/sidebar-item';
import MenuItems from '@/_components/sidebar/items';

const Sidebar = () => {
  return (
    <SidebarContextProvider>
      <SidebarLayout>
        {MenuItems.map(({ name, path, icon, items }) => (
          <React.Fragment key={name}>
            {name === "Instillinger" && <hr className="my-2"/>} {/* Add horizontal line */}
            <SubMenuContextProvider>
              <SidebarItem key={name} name={name} path={path} icon={icon} items={items} />
            </SubMenuContextProvider>
          </React.Fragment>
        ))}
      </SidebarLayout>
    </SidebarContextProvider>
  );
};

export default Sidebar;