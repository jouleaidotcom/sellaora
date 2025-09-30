const HeroSection = ({ section, theme }) => {
  return (
    <div className="px-6 py-16 text-center" style={{ background: theme?.primaryColor || '#eff6ff' }}>
      <h1 className="text-3xl md:text-5xl font-bold text-white">{section.title || 'Hero Title'}</h1>
      <p className="mt-3 text-white/90">{section.subtitle || 'Hero subtitle'}</p>
    </div>
  );
};

export default HeroSection;


