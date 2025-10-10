import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import EditableComponent from './EditableComponent';

const SortableItem = ({ component, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onNavigatePage, theme }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group" {...listeners} {...attributes}>
      <div
        className={`relative ${
          isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : 'hover:ring-2 hover:ring-blue-300'
        }`}
        onClick={() => onSelect(component)}
      >
        <EditableComponent component={component} onUpdate={onUpdate} onNavigatePage={onNavigatePage} theme={theme} />
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
  theme,
}) => {
  // Always-present droppable area so library items can be dropped onto an empty canvas
  const { setNodeRef: setCanvasRef, isOver } = useDroppable({ id: 'canvas-dropzone' });

  const pageBg = theme?.backgroundColor || '#ffffff';

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: pageBg }}>
      <div className="max-w-7xl mx-auto py-8">
        <div ref={setCanvasRef} className={`bg-white shadow-2xl rounded-lg overflow-hidden ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
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
                  theme={theme}
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
