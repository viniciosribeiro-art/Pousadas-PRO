
import React from 'react';
import { User } from '../../types';
import { LogoutIcon } from '../icons/Icons';

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

interface HeaderProps {
  toggleSidebar: () => void;
  currentUser: User | null;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentUser, handleLogout }) => {
  return (
    <header className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        onClick={toggleSidebar}
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          {/* Search bar could go here */}
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                title="Sair"
              >
                <LogoutIcon className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
