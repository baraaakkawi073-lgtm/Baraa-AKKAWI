import React from 'react';
import type { ActiveView } from '../App';
import { MosqueIcon, MoonStarIcon, BookOpenIcon, MessageCircleIcon } from './icons';

interface BottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  label: string;
  view: ActiveView;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-teal-500'}`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { label: 'الصلاة', view: 'prayer', icon: <MosqueIcon className="h-6 w-6" /> },
    { label: 'الأذكار', view: 'azkar', icon: <MoonStarIcon className="h-6 w-6" /> },
    { label: 'الأحاديث', view: 'hadith', icon: <BookOpenIcon className="h-6 w-6" /> },
    { label: 'المساعد', view: 'ai', icon: <MessageCircleIcon className="h-6 w-6" /> },
  // FIX: Use 'as const' to infer the literal types for 'view', making them assignable to 'ActiveView'.
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-1px_5px_rgba(0,0,0,0.05)] flex justify-around border-t">
      {navItems.map(item => (
        <NavItem
          key={item.view}
          label={item.label}
          view={item.view}
          icon={item.icon}
          isActive={activeView === item.view}
          onClick={() => setActiveView(item.view)}
        />
      ))}
    </div>
  );
};

export default BottomNav;