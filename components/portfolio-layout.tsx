'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type ComponentType } from 'react';
import SidebarNav from './sidebar-nav';
import { HeroSection } from './sections/hero-section';

type Section =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'certifications'
  | 'contact';

const SectionLoadingFallback = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-8 text-sm text-white/60">
    Loading section...
  </div>
);

const AboutSection = dynamic(() => import('./sections/about-section'), {
  loading: SectionLoadingFallback,
});

const SkillsSection = dynamic(() => import('./sections/skills-section'), {
  loading: SectionLoadingFallback,
});

const ProjectsSection = dynamic(() => import('./sections/projects-section'), {
  loading: SectionLoadingFallback,
});

const ExperienceSection = dynamic(() => import('./sections/experience-section'), {
  loading: SectionLoadingFallback,
});

const CertificationsSection = dynamic(() => import('./sections/certifications-section'), {
  loading: SectionLoadingFallback,
});

const ContactSection = dynamic(() => import('./sections/contact-section'), {
  loading: SectionLoadingFallback,
});

const sections: Array<{ id: Section; label: string; component: ComponentType }> = [
  { id: 'hero', label: 'Home', component: HeroSection },
  { id: 'about', label: 'About', component: AboutSection },
  { id: 'skills', label: 'Skills', component: SkillsSection },
  { id: 'projects', label: 'Projects', component: ProjectsSection },
  { id: 'experience', label: 'Experience', component: ExperienceSection },
  { id: 'certifications', label: 'Certifications', component: CertificationsSection },
  { id: 'contact', label: 'Contact', component: ContactSection },
];

const sectionIds = new Set(sections.map((section) => section.id));

function isSection(value: string): value is Section {
  return sectionIds.has(value as Section);
}

export default function PortfolioLayout() {
  const [activeSection, setActiveSection] = useState<Section>('hero');

  useEffect(() => {
    const syncSectionFromHash = () => {
      const hash = window.location.hash.replace('#', '').trim();

      if (!hash) {
        setActiveSection('hero');
        return;
      }

      if (isSection(hash)) {
        setActiveSection(hash);
      }
    };

    syncSectionFromHash();
    window.addEventListener('hashchange', syncSectionFromHash);

    return () => window.removeEventListener('hashchange', syncSectionFromHash);
  }, []);

  useEffect(() => {
    const nextUrl =
      activeSection === 'hero'
        ? `${window.location.pathname}${window.location.search}`
        : `${window.location.pathname}${window.location.search}#${activeSection}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  }, [activeSection]);

  const currentSection = sections.find((section) => section.id === activeSection);
  const Component = currentSection?.component ?? HeroSection;

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SidebarNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        sections={sections}
      />

      <main className="ml-64 flex-1 overflow-y-auto">
        {activeSection === 'hero' ? (
          <Component />
        ) : (
          <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
            <div className="mb-12">
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {currentSection?.label}
              </h1>
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-transparent" />
            </div>

            <Component />
          </div>
        )}
      </main>
    </div>
  );
}
