import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { staggerContainer } from '../utils/motionVariants';
import { projects } from '../data/projects';

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e) => { if (e.key === 'Escape') setActiveProject(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeProject]);

  return (
    <section id="projects" data-smoke-theme="purple-gold" className="py-[120px] bg-bg-alt">
      <div className="max-w-[1180px] mx-auto px-8">
        <SectionTitle index="04" label="Selected Work">
          A few things I've <span className="italic font-medium text-purple">shipped</span>.
        </SectionTitle>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} onOpen={setActiveProject} />
          ))}
        </motion.div>
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}