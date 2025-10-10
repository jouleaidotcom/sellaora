import { useDraggable } from '@dnd-kit/core';

const ComponentLibraryItem = ({ id, type, icon, label }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${type}`,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-neutral-900 rounded-lg p-4 shadow-sm border-2 border-neutral-800 hover:border-emerald-500 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="text-3xl mb-2 text-center">{icon}</div>
      <p className="text-sm font-medium text-neutral-200 text-center">{label}</p>
    </div>
  );
};

const ComponentLibrary = () => {
  const components = [
    { type: 'navbar', icon: '📋', label: 'Navigation' },
    { type: 'hero', icon: '🎯', label: 'Hero' },
    { type: 'features', icon: '⭐', label: 'Features' },
    { type: 'textblock', icon: '📝', label: 'Text Block' },
    { type: 'footer', icon: '📄', label: 'Footer' },
    // New components
    { type: 'faq', icon: '❓', label: 'FAQ' },
    { type: 'gallery', icon: '🖼️', label: 'Image Gallery' },
    { type: 'newsletter', icon: '📬', label: 'Newsletter' },
    { type: 'signup', icon: '🧑‍💻', label: 'Sign Up' },
    { type: 'login', icon: '🔐', label: 'Login' },
    { type: 'waitlist', icon: '⏳', label: 'Waitlist' },
    { type: 'contact', icon: '✉️', label: 'Contact' },
    { type: 'collection', icon: '🛍️', label: 'Collection Grid' },
    { type: 'testimonials', icon: '💬', label: 'Testimonials' },
    { type: 'pricing', icon: '💲', label: 'Pricing' },
    { type: 'cta', icon: '📣', label: 'Call to Action' },
    { type: 'divider', icon: '➖', label: 'Divider' },
    { type: 'spacer', icon: '⬜', label: 'Spacer' },
    { type: 'image', icon: '🖼️', label: 'Image' },
    { type: 'video', icon: '🎞️', label: 'Video' },
    { type: 'button', icon: '🔘', label: 'Button' },
  ];

  return (
    <div className="w-64 bg-neutral-900 border-r border-neutral-800 overflow-y-auto flex-shrink-0 text-neutral-100">
      <div className="p-4">
        <h2 className="text-lg font-bold text-neutral-100 mb-4 flex items-center">
          <span className="mr-2">🧩</span>
          Components
        </h2>
        <p className="text-xs text-neutral-400 mb-4">Drag components to the canvas</p>
        <div className="space-y-3">
          {components.map((component) => (
            <ComponentLibraryItem
              key={component.type}
              id={component.type}
              type={component.type}
              icon={component.icon}
              label={component.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;
