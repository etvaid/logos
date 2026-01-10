'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onValueChange?: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

// Simple tabs API
interface SimpleTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

// Compound tabs API
interface CompoundTabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

type TabsProps = SimpleTabsProps | CompoundTabsProps;

function isSimpleTabsProps(props: TabsProps): props is SimpleTabsProps {
  return 'tabs' in props && Array.isArray(props.tabs);
}

export function Tabs(props: TabsProps) {
  // Simple tabs mode
  if (isSimpleTabsProps(props)) {
    const { tabs, activeTab, onChange, className = '' } = props;
    return (
      <div className={`flex gap-1 p-1 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all
              ${
                activeTab === tab.id
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/10'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  // Compound tabs mode
  const { defaultValue, children, className = '', onValueChange } = props;
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div
      className={`
        flex gap-1 p-1 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-2 text-sm font-medium rounded-md transition-all
        ${
          isActive
            ? 'bg-[#C9A962] text-[#0D0D0F]'
            : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/10'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.activeTab !== value) return null;

  return <div className={className}>{children}</div>;
}
