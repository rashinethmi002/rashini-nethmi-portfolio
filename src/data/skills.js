import { FiCode, FiServer, FiDatabase, FiCpu, FiTool, FiLayers } from 'react-icons/fi';

export const techStack = [
  'JavaScript', 'React.js', 'Next.js', 'Node.js', 'Express.js',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Java', 'PHP', 'C#', 'Tailwind CSS',
];

export const skillGroups = [
  { title: 'Frontend', icon: FiCode, items: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5 / CSS3'] },
  { title: 'Backend', icon: FiServer, items: ['Node.js', 'Express.js', 'REST APIs', 'PHP'] },
  { title: 'Databases', icon: FiDatabase, items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Prisma ORM'] },
  { title: 'Languages', icon: FiCpu, items: ['Java', 'JavaScript', 'C#', 'Python'] },
  { title: 'Tools', icon: FiTool, items: ['Git & GitHub', 'VS Code', 'Postman','Power BI'] },
  { title: 'Core', icon: FiLayers, items: ['OOP', 'SDLC', 'System Design'] },
];