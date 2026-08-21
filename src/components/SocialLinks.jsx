import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { socials } from '../data/socials';

const iconMap = { github: FiGithub, linkedin: FiLinkedin, mail: FiMail };

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {socials.map((s) => {
        const Icon = iconMap[s.icon];
        return (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-label={s.label}
            className="w-[42px] h-[42px] rounded-full border border-border flex items-center justify-center text-muted hover:text-purple hover:border-purple hover:-translate-y-1 transition-all"
          >
            <Icon size={17} />
          </a>
        );
      })}
    </div>
  );
}