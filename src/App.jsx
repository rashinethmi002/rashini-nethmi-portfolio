import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SmokeCursor from './components/SmokeCursor';
import PageIntro from './components/PageIntro';

export default function App() {
  return (
    <PageIntro>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Certifications />
        <Projects />
        <Contact />
        <Footer />
        <SmokeCursor />
      </main>
    </PageIntro>
  );
}