import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiGithub } from 'react-icons/fi';

function Section({ label, children }) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="font-mono text-[12px] font-bold uppercase tracking-[.1em] text-gold mb-2">{label}</h4>
      <div className="text-[14.5px] text-muted leading-relaxed">{children}</div>
    </div>
  );
}

function ModalImage({ project }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="order-1 md:order-2 relative h-[min(38dvh,420px)] min-h-[220px] sm:h-52 md:h-auto bg-surface-2">
      {!imgFailed ? (
        <img
          src={project.image}
          alt={project.title}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-soft to-surface-2">
          <span className="font-display italic text-5xl text-purple">RN</span>
        </div>
      )}
    </div>
  );
}

export default function ProjectModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 sm:p-8"
        >
          <motion.div
            key={project.slug}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-[calc(100dvh-40px)] sm:h-auto sm:max-h-[90vh] max-w-[1100px] bg-surface border border-border rounded-[24px] sm:rounded-[28px] shadow-soft overflow-hidden grid grid-rows-[minmax(0,1fr)_auto] md:grid-rows-none md:grid-cols-[1fr_1.15fr]"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 rounded-full bg-surface/90 border border-border flex items-center justify-center text-ink hover:border-purple hover:text-purple transition-colors"
            >
              <FiX size={16} />
            </button>

            <div className="order-2 md:order-1 min-h-0 overflow-y-auto px-5 py-6 sm:px-9 sm:py-10 md:max-h-[88vh]">
              <h3 className="font-display text-[26px] sm:text-[28px] font-medium leading-tight mb-5 sm:mb-6 pr-8">
                {project.title}
              </h3>

              {project.overview && <Section label="Overview">{project.overview}</Section>}
              {project.problem && <Section label="Problem">{project.problem}</Section>}
              {project.solution && <Section label="Solution">{project.solution}</Section>}

              {project.features?.length > 0 && (
                <Section label="Key Features">
                  <ul className="space-y-1.5 mt-1">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex gap-2 text-[14px] leading-relaxed">
                        <span className="text-purple mt-[3px]">›</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {project.techStack?.length > 0 && (
                <Section label="Tech Stack">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.techStack.map((t) => (
                      <span key={t} className="text-[11.5px] font-mono font-semibold px-2.5 py-1.5 rounded-md bg-purple-soft text-purple">
                        {t}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {project.futureImprovements && (
                <Section label="Future Improvements">{project.futureImprovements}</Section>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-purple hover:underline"
                >
                  <FiGithub size={15} /> View on GitHub
                </a>
              )}
            </div>

            <ModalImage project={project} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}