import { SidebarItemType } from '@/_components/sidebar/sidebar-item';

import {
  IoThermometerOutline,
  IoFlask,
  IoCalendarOutline,
  IoHelpCircleOutline,
} from 'react-icons/io5';

const IconSize = 20;

const MenuItems: SidebarItemType[] = [
  {
    name: "Status",
    path: "/status",
    icon: <IoThermometerOutline size={IconSize} />,
  },
  {
    name: "Eksperimenter",
    path: "/eksperimenter",
    icon: <IoFlask size={IconSize} />,
    /*
    items: [
      {
        name: "Oversikt",
        path: "/eksperimenter",
      },
      {
        name: "Rediger eksperiment",
        path: "/eksperimenter/rediger",
      },
      {
        name: "Resultater",
        path: "/eksperimenter/resultater",
      },
    ],
    */
  },
  {
    name: "Kalender",
    path: "/kalender",
    icon: <IoCalendarOutline size={IconSize} />,
  },
  {
    name: "Hjelp",
    path: "/hjelp",
    icon: <IoHelpCircleOutline size={IconSize} />,
  },
];

export default MenuItems;