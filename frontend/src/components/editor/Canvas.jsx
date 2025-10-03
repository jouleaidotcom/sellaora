import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import EditableComponent from './EditableComponent';

const SortableItem = ({ component, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onNavigatePage }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        className={`relative ${
          isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : 'hover:ring-2 hover:ring-blue-300'
        }`}
        onClick={() => onSelect(component)}
      >
        <EditableComponent component={component} onUpdate={onUpdate} onNavigatePage={onNavigatePage} />

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            {...listeners}
            {...attributes}
            className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            ↕️ Move
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(component.id);
            }}
          >
            📋 Copy
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this component?')) {
                onDelete(component.id);
              }
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Canvas = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onNavigatePage,
}) => {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">Canvas is empty</p>
                <p className="text-sm">Drag components from the left sidebar to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {components.map((component) => (
                <SortableItem
                  key={component.id}
                  component={component}
                  isSelected={selectedComponent?.id === component.id}
                  onSelect={onSelectComponent}
                  onUpdate={onUpdateComponent}
                  onDelete={onDeleteComponent}
                  onDuplicate={onDuplicateComponent}
                  onNavigatePage={onNavigatePage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
