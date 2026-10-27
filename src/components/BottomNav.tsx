import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: AppTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'blur_on' },
    { id: 'chat', label: 'Chat', icon: 'forum' },
    { id: 'apps', label: 'Apps', icon: 'grid_view' },
    { id: 'settings', label: 'Settings', icon: 'shield_with_heart' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.5)] border-t border-primary-container/10">
      <div className="h-16 px-gutter flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all ${
                isActive
                  ? 'text-primary-container font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {/* Glowing top pill for active state */}
              <div
                className={`nav-glow absolute -top-1 w-8 h-1 rounded-full bg-primary-container shadow-[0_0_12px_#00f0ff] transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              />
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isActive ? 'text-primary-container drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm tracking-wider uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
