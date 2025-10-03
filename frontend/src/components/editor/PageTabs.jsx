import React from 'react';

const PageTabs = ({ pages, currentIndex, onSelect, onAdd, onRename, onDelete }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
      {pages.map((p, idx) => (
        <div key={p.id} className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${idx === currentIndex ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}>
          <button onClick={() => onSelect(idx)} className="text-sm font-medium">
            {p.name}
          </button>
          <button
            onClick={() => {
              const name = prompt('Rename page', p.name);
              if (name && name.trim()) onRename(idx, name.trim());
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
            title="Rename page"
          >
            ✎
          </button>
          {pages.length > 1 && (
            <button
              onClick={() => onDelete(idx)}
              className="text-xs text-red-600 hover:text-red-700"
              title="Delete page"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button onClick={onAdd} className="ml-2 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
        + Add page
      </button>
    </div>
  );
};

export default PageTabs;
