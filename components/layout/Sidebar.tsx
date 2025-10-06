
import React, { Fragment } from 'react';
import { NAVIGATION_ITEMS } from '../../constants';
import { Page, User } from '../../types';
import { XIcon } from '../icons/Icons';
import { hasPermission } from '../../utils/permissions';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentUser: User;
    pousadaName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen, currentUser, pousadaName }) => {
    
    const allowedNavItems = NAVIGATION_ITEMS.filter(item => hasPermission(currentUser.role, item.id as any));
    
    const handleNavigation = (page: Page) => {
        setActivePage(page);
        if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
        }
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 flex-shrink-0">
                <span className="text-white text-2xl font-bold truncate">{pousadaName}</span>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-300 hover:text-white">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {allowedNavItems.map((item) => (
                    <a
                        key={item.id}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(item.id);
                        }}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activePage === item.id
                                ? 'bg-brand-secondary text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon className="mr-3 h-6 w-6" />
                        {item.label}
                    </a>
                ))}
            </nav>
        </div>
    );
    
    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex md:hidden ${isOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setIsOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                    {sidebarContent}
                </div>
            </div>
            
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-gray-800">
                        {sidebarContent}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
