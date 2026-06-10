'use client';

import {
  Award,
  Briefcase,
  FileText,
  Home,
  Mail,
  User,
  Zap,
} from 'lucide-react';

interface SidebarNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: Array<{ id: string; label: string }>;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  hero: Home,
  about: User,
  skills: Zap,
  projects: Briefcase,
  experience: FileText,
  certifications: Award,
  contact: Mail,
};

function NavItem({
  section,
  isActive,
  onClick,
}: {
  section: { id: string; label: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = iconMap[section.id] || User;

  return (
    <button
      onClick={onClick}
      className="group relative flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left"
      style={{ outline: 'none' }}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${
          isActive ? 'bg-white/10 opacity-100' : 'bg-white/5 opacity-0 group-hover:opacity-100'
        }`}
      />

      {isActive && (
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-0 top-2 w-[2.5px] rounded-full bg-white"
        />
      )}

      <Icon
        size={19}
        className="relative z-10 shrink-0 transition-colors duration-200"
        style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)' }}
      />

      <span
        className="relative z-10 transition-colors duration-200"
        style={{
          color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
          fontFamily: "'Inter', 'DM Sans', sans-serif",
          fontSize: '15px',
          fontWeight: isActive ? 500 : 400,
          letterSpacing: '-0.01em',
        }}
      >
        {section.label}
      </span>
    </button>
  );
}

export default function SidebarNav({
  activeSection,
  onSectionChange,
  sections,
}: SidebarNavProps) {
  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col px-4 py-8"
      style={{
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="mb-10 flex items-center gap-3 px-4">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            KS
          </span>
        </div>

        <span
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          Keya Sheth
        </span>
      </div>

      <div className="mb-2 px-4">
        <span
          style={{
            color: 'rgba(255,255,255,0.22)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Navigation
        </span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {sections.map((section) => (
          <NavItem
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onClick={() => onSectionChange(section.id)}
          />
        ))}
      </nav>

      <div className="px-4 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span
          style={{
            color: 'rgba(255,255,255,0.2)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            letterSpacing: '-0.01em',
          }}
        >
          (c) 2024 Keya Sheth
        </span>
      </div>
    </aside>
  );
}
