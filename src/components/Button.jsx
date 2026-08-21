export default function Button({ as: As = 'button', variant = 'primary', className = '', children, ...props }) {
  const base =
    'inline-flex items-center gap-2 rounded-full text-sm font-semibold px-5 py-3 transition-all duration-300';

  const variants = {
    primary:
      'bg-purple text-white shadow-[0_10px_24px_-8px_rgba(108,76,241,0.55)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-8px_rgba(108,76,241,0.6)]',
    ghost:
      'bg-transparent border border-border text-ink hover:border-purple hover:text-purple hover:-translate-y-0.5',
    light:
      'bg-white text-purple-deep shadow-[0_14px_30px_-10px_rgba(0,0,0,0.35)] hover:-translate-y-0.5',
  };

  return (
    <As className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </As>
  );
}