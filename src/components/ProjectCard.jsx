import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { fadeUp } from '../utils/motionVariants';

export default function ProjectCard({ project, index, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const accent = index % 2 === 0 ? 'purple' : 'gold';

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${project.title} details`}
      className={`group relative flex cursor-pointer flex-col bg-surface border border-border rounded-2xl overflow-hidden transition-shadow duration-300 ${
        accent === 'purple'
          ? 'hover:shadow-[0_24px_55px_-18px_rgba(108,76,241,0.45)] hover:border-purple'
          : 'hover:shadow-[0_24px_55px_-18px_rgba(200,147,63,0.4)] hover:border-gold'
      }`}
    >
      {/* top accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
          accent === 'purple' ? 'bg-gradient-to-r from-purple to-purple-deep' : 'bg-gradient-to-r from-gold to-purple'
        }`}
      />

      {/* thumbnail + hover overlay */}
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        {!imgFailed ? (
          <img
            src={project.image}
            alt={project.title}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-soft to-surface-2">
            <span className="font-display italic text-3xl text-purple">RN</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-gradient-to-t from-purple-deep/90 via-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="View source on GitHub"
            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 hover:bg-white hover:text-purple-deep hover:scale-110"
          >
            <FiGithub size={18} />
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="View live preview"
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150 hover:bg-white hover:text-purple-deep hover:scale-110"
            >
              <FiExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="font-mono text-[11px] tracking-[.14em] uppercase text-purple mb-2">
          {project.category}
        </p>

        <h3 className="text-lg font-semibold font-display leading-snug mb-3">{project.title}</h3>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag, j) => {
            const tagAccent = (index + j) % 2 === 0 ? 'purple' : 'gold';
            return (
              <span
                key={tag}
                className={`text-[10.5px] font-mono font-bold uppercase tracking-wide px-2.5 py-1 rounded-md ${
                  tagAccent === 'purple' ? 'bg-purple-soft text-purple' : 'bg-gold-soft text-gold'
                }`}
              >
                {tag}
              </span>
            );
          })}
        </div>

        <p className="text-sm text-muted leading-relaxed flex-1">{project.description}</p>

        <button
          onClick={() => onOpen(project)}
          className={`mt-5 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-full border px-4 py-2.5 transition-all w-fit active:scale-95 ${
            accent === 'purple'
              ? 'border-border hover:border-purple hover:text-purple hover:bg-purple-soft'
              : 'border-border hover:border-gold hover:text-gold hover:bg-gold-soft'
          }`}
        >
          Read more
        </button>
      </div>
    </motion.div>
  );
}