import AutoSection from '../shared/AutoSection';

// AI-first: render every section through AutoSection. This supports arbitrary JSON shapes.

const LivePreview = ({ store, products }) => {
  if (!store) return null;
  const layout = store?.layout || {};
  const sections = Array.isArray(layout.pages) ? (layout.pages[0]?.sections || []) : (layout.sections || []);
  const theme = store?.theme || {};

  return (
    <div className="bg-white text-neutral-900 shadow rounded-lg overflow-hidden">
      {sections.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No sections yet. Use the editor to add sections.</div>
      ) : (
        sections.map((section, idx) => (
          <AutoSection key={idx} section={section} theme={theme} products={products} />
        ))
      )}
    </div>
  );
};

export default LivePreview;


