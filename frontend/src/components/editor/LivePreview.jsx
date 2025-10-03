import HeroSection from '../store/sections/HeroSection';
import FeaturedProducts from '../store/sections/FeaturedProducts';
import TextBlock from '../store/sections/TextBlock';

// Lightweight inline renderers for new types
const FeaturesSection = ({ section }) => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">{section.title || 'Why choose us'}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(section.items || []).map((it, i) => (
        <div key={i} className="border rounded p-4 bg-white text-center">
          <div className="text-2xl mb-1">{it.icon || '⭐'}</div>
          <div className="font-semibold">{it.title || 'Feature'}</div>
          <div className="text-sm text-gray-600">{it.description || ''}</div>
        </div>
      ))}
    </div>
  </div>
);

const NavbarMini = ({ section }) => (
  <div className="px-6 py-3 border-b bg-white flex items-center justify-between">
    <div className="font-bold">{section.logo || 'Logo'}</div>
    <div className="flex gap-4 text-sm text-gray-700">
      {(section.links || []).map((l, i) => (
        <span key={i} className="opacity-80">{l.text || 'Link'}</span>
      ))}
    </div>
  </div>
);

const FooterMini = ({ section }) => (
  <div className="px-6 py-6 border-t bg-gray-50 text-center text-sm text-gray-600">
    <div className="font-medium mb-1">{section.companyName || 'Company Name'}</div>
    <div className="opacity-80">{section.tagline || ''}</div>
  </div>
);

const sectionRegistry = {
  hero: HeroSection,
  featuredProducts: FeaturedProducts,
  text: TextBlock,
  // New normalized types
  features: FeaturesSection,
  textblock: ({ section }) => <TextBlock section={{ heading: section.heading, body: section.content }} />,
  navbar: NavbarMini,
  footer: FooterMini,
};

const LivePreview = ({ store, products }) => {
  if (!store) return null;
  const layout = store?.layout || {};
  const sections = Array.isArray(layout.pages) ? (layout.pages[0]?.sections || []) : (layout.sections || []);
  const theme = store?.theme || {};

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {sections.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No sections yet. Use the editor to add sections.</div>
      ) : (
        sections.map((section, idx) => {
          const type = String(section.type || '').toLowerCase();
          const Comp = sectionRegistry[type] || TextBlock;
          return <Comp key={idx} section={section} theme={theme} products={products} />;
        })
      )}
    </div>
  );
};

export default LivePreview;


