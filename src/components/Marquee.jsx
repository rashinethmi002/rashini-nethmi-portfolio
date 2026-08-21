import { techStack } from '../data/skills';

export default function Marquee() {
  // duplicated once so the CSS translateX(-50%) loop is seamless
  const items = [...techStack, ...techStack];

  return (
    <div className="marquee-wrap group border-y border-border overflow-hidden py-[30px] bg-bg-alt">
      <div className="marquee flex w-max gap-12 animate-[scrollMarquee_32s_linear_infinite] group-hover:[animation-play-state:paused]">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="flex items-center gap-3 font-mono text-[15.5px] font-bold text-muted whitespace-nowrap tracking-wide before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-purple before:opacity-55 before:shrink-0"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}