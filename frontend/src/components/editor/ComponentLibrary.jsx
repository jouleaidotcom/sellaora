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
      className={`bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200 hover:border-blue-500 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="text-3xl mb-2 text-center">{icon}</div>
      <p className="text-sm font-medium text-gray-700 text-center">{label}</p>
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
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🧩</span>
          Components
        </h2>
        <p className="text-xs text-gray-500 mb-4">Drag components to the canvas</p>
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
