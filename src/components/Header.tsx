import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  onProfileClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onProfileClick,
  showBack,
  onBack,
  titleOverride,
  subtitleOverride,
}) => {
  const getSubtitle = () => {
    if (subtitleOverride) return subtitleOverride;
    switch (currentTab) {
      case 'home':
        return 'Neural Core';
      case 'chat':
        return 'Neural Chat';
      case 'apps':
        return 'Telemetry Apps';
      case 'settings':
        return 'System Controls';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
      {/* Top Mobile Status Telemetry Bar */}
      <div className="px-margin py-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm tracking-widest">
        <span>09:41</span>
        <div className="flex items-center gap-space-sm">
          <span className="flex items-center gap-0.5 text-primary">
            <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
            <span>5G</span>
          </span>
          <span className="material-symbols-outlined text-[14px]">wifi</span>
          <span className="flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px] text-primary-container">
              battery_charging_full
            </span>
            <span>98%</span>
          </span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          {showBack ? (
            <button
              aria-label="Go back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <div className="relative w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shadow-[0_0_12px_rgba(0,240,255,0.35)] shrink-0">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 8C15 6.5 13.5 6 12 6C8.5 6 7 8 7 10C7 14 17 12 17 16C17 19 14.5 20 12 20C9.5 20 8 18.5 7.5 17"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-container animate-ping" />
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                {titleOverride || 'SHREE AI'}
              </span>
              <span className="font-label-sm text-label-sm text-secondary uppercase">v4.2</span>
            </div>
            <h1 className="font-label-md text-label-md text-on-surface-variant truncate">
              {getSubtitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/80 text-primary-fixed font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <span>CORE: ONLINE | 99.8%</span>
          </div>

          <button
            onClick={onProfileClick}
            className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
            title="Profile & Controls"
          >
            <div className="relative">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-[0_0_12px_rgba(0,240,255,0.35)] border border-primary-container/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4RtMC1wDgZ4EieHOdW5OawvsIOOWdfUTwo3oNUjA8UZuwKQB293fTdEoj9YUKjvIrWQ1whiY_AfiB63ANrVzs4hq6QbRSTXtxz0ldN7OZxO6ohbD1_VaEQQLj97YETbUvIGzxP3Dhqh51lwupSgEw5COvfi1ZGPQmjlpp3ZVIRkAvB6ygmueXGaZAg2nOqoRtn9bedDBjms225nJbfiq6l3PFqSn5KhAIWkWlU9PoPaW5J5NBs8a1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary-container ring-1 ring-surface" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
