export default function Footer() {
  return (
    <footer className="max-w-[1180px] mx-auto px-8 py-10 sm:py-[50px] flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-[13px] text-muted">
        © {new Date().getFullYear()} Rashini Nethmi Sandeepani. Designed &amp; built with intent.
      </p>
      <div className="flex gap-4.5 text-[13px] text-muted">
        <a href="https://github.com/rashinethmi002" target="_blank" rel="noopener" className="hover:text-purple transition-colors">GitHub ↗</a>
        <a href="https://www.linkedin.com/in/rashini-nethmi-80b6b4346/" target="_blank" rel="noopener" className="hover:text-purple transition-colors">LinkedIn ↗</a>
        <a href="mailto:rashinethmi002@gmail.com" className="hover:text-purple transition-colors">Email ↗</a>
      </div>
    </footer>
  );
}