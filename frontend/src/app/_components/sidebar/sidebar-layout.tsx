'use client';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useSidebarContext } from '@/_lib/context/sidebar-context';

type SidebarProps = {
  children: React.ReactNode;
};

const SidebarLayout: React.FC<SidebarProps> = ({ children }) => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="top-0 col-span-1 self-start sticky h-screen z-50">
      <nav className={`h-full flex flex-col bg-white border-r shadow-sm transition-all ${!collapsed ? "w-80" : "w-20"}`}>
        <div className={`p-4 pb-5 flex items-center ${!collapsed ? 'justify-between' : 'justify-center'}`}>
          <div className="h-12 flex items-center flex-grow-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo for Snarøya Curlinghall"
              className={`overflow-hidden  h-fit ${!collapsed ? "w-full" : "w-0"}`}
            />
          </div>
          <div className={`${!collapsed ? "pl-4" : "pl-0"}`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {!collapsed ? <FiChevronsLeft /> : <FiChevronsRight />}
            </button>
          </div>
        </div>
        
        <ul className="flex-1 px-3 space-y-2">
          <hr className="mb-2"/>
          {children}
        </ul>

      </nav>
    </aside>
  );
};

export default SidebarLayout;