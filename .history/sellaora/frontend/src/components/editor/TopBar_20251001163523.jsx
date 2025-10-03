import { storeName } from '../../pages/Dashboard';
const TopBar = ({ onUndo, onRedo, onSave, onExit, canUndo, canRedo, isSaving }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900" htmlFor="storeName">
            {storeName}
          </h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">Visual Page Builder</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              canUndo
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <span>↶</span>
            Undo
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              canRedo
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <span>↷</span>
            Redo
          </button>

          <div className="h-8 w-px bg-gray-300"></div>

          <button
            onClick={onSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isSaving
                ? 'bg-green-400 text-white cursor-wait'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
            }`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⟳</span>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save
              </>
            )}
          </button>

          <button
            onClick={onExit}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-sm"
          >
            Exit to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
