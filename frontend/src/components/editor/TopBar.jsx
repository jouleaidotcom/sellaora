import PublishButton from './PublishButton';

const TopBar = ({ onUndo, onRedo, onSave, onExit, canUndo, canRedo, isSaving, storeId, jsonLayout, storeName }) => {
  return (
    <div className="bg-neutral-900 border-b border-neutral-800 shadow-sm text-neutral-100">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            {storeName || 'My Store'}
          </h1>
          <div className="h-6 w-px bg-neutral-700"></div>
          <span className="text-sm text-neutral-400">Visual Page Builder</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              canUndo
                ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                : 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
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
                ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                : 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <span>↷</span>
            Redo
          </button>

          <div className="h-8 w-px bg-neutral-700"></div>

          <button
            onClick={onSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isSaving
                ? 'bg-emerald-500 text-white cursor-wait'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
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

          <PublishButton
            storeId={storeId}
            jsonLayout={jsonLayout}
            onPublishSuccess={(data) => {
              console.log('Published successfully:', data);
              // You can add more success handling here
            }}
            onPublishError={(error) => {
              console.error('Publish failed:', error);
              alert(`Publishing failed: ${error}`);
            }}
          />

          <button
            onClick={onExit}
            className="px-6 py-2 bg-neutral-800 text-neutral-100 rounded-lg font-medium hover:bg-neutral-700 transition-all shadow-sm"
          >
            Exit to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
