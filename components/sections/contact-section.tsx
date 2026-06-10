'use client';

import { portfolioData } from '@/lib/portfolio-data';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

type ContactLink = {
  key: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href: string;
};

function ContactCard({ icon: Icon, label, value, href }: ContactLink) {
  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 no-underline transition-colors duration-200 hover:border-purple-400/40 hover:bg-white/[0.05]"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <Icon size={18} className="text-white/70" />
      </div>
      <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="truncate text-sm font-medium text-white/80">{value}</p>
    </a>
  );
}

export default function ContactSection() {
  const { contact } = portfolioData;

  const links: ContactLink[] = [
    {
      key: 'email',
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      key: 'phone',
      icon: Phone,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
  ];

  const githubUrl = contact.social?.find((item) => item.platform === 'GitHub')?.url;
  const linkedinUrl = contact.social?.find((item) => item.platform === 'LinkedIn')?.url;

  if (githubUrl && githubUrl !== '#') {
    links.push({
      key: 'github',
      icon: Github,
      label: 'GitHub',
      value: '@' + githubUrl.split('/').filter(Boolean).pop(),
      href: githubUrl,
    });
  }

  if (linkedinUrl && linkedinUrl !== '#') {
    links.push({
      key: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      value: '@' + linkedinUrl.split('/').filter(Boolean).pop(),
      href: linkedinUrl,
    });
  }

  return (
    <section className="space-y-10">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Contact</p>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Let&apos;s Connect
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-white/55">
          Reach me directly through email, phone, GitHub, or LinkedIn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map(({ key, ...link }) => (
          <ContactCard key={key} {...link} />
        ))}
      </div>

      {contact.availability && (
        <div className="flex w-fit items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-5 py-3.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm text-white/60">{contact.availability}</span>
        </div>
      )}
    </section>
  );
}
