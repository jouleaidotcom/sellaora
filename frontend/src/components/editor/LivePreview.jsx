import HeroSection from '../store/sections/HeroSection';
import FeaturedProducts from '../store/sections/FeaturedProducts';
import TextBlock from '../store/sections/TextBlock';

const sectionRegistry = {
  hero: HeroSection,
  featuredProducts: FeaturedProducts,
  text: TextBlock,
};

const LivePreview = ({ store, products }) => {
  if (!store) return null;
  const sections = store?.layout?.sections || [];
  const theme = store?.theme || {};

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {sections.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No sections yet. Use the editor to add sections.</div>
      ) : (
        sections.map((section, idx) => {
          const Comp = sectionRegistry[section.type] || TextBlock;
          return <Comp key={idx} section={section} theme={theme} products={products} />;
        })
      )}
    </div>
  );
};

export default LivePreview;


