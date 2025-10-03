import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation  } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import ComponentLibrary from '../components/editor/ComponentLibrary';
import Canvas from '../components/editor/Canvas';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import TopBar from '../components/editor/TopBar';

const Editor = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [components, setComponents] = useState([]);
  const [htmlContent, setHtmlContent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const { storeName } = location.state || {};

  console.log('Navigating to editor with store name:', storeName || 'No Store Name');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const loadEditor = async () => {
      try {
        const storeId = localStorage.getItem('editorStoreId');
        if (!storeId) {
          // fallback to mock
          setComponents([]);
          setHistory([[]]);
          setHistoryIndex(0);
          return;
        }

        const res = await fetch(`/api/store/${storeId}/editor`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Failed to fetch editor data');
        const body = await res.json();
        const payload = body.data;

        // Attempt to use parsed layout -> components, otherwise default to empty
        let comps = [];
        try {
          if (payload.layout && Array.isArray(payload.layout.sections)) {
            // convert layout.sections to editor components if they look like components
            comps = payload.layout.sections.map((s, idx) => ({ id: `${s.type || 'section'}-${idx}`, type: s.type || 'textblock', props: s }));
          }
        } catch {
          comps = [];
        }

        // htmlContent may be provided by backend (AI generated or saved)
        // Sometimes htmlContent is actually a JSON stringified layout. Detect that and convert it to components.
        let rawHtml = payload.htmlContent || null;
        if (rawHtml) {
          const trimmed = rawHtml.trim();
          // Try direct JSON parse if it looks like JSON
          let parsedJson = null;
          try {
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
              parsedJson = JSON.parse(trimmed);
            } else {
              // Try to extract JSON embedded inside HTML (e.g. <div>JSON</div>)
              const firstIdx = Math.min(
                ...( [trimmed.indexOf('{'), trimmed.indexOf('[')].filter(i => i >= 0)
              ));
              if (!Number.isNaN(firstIdx) && firstIdx >= 0) {
                const lastIdx = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
                if (lastIdx > firstIdx) {
                  const candidate = trimmed.slice(firstIdx, lastIdx + 1);
                  parsedJson = JSON.parse(candidate);
                }
              }
            }
          } catch {
            parsedJson = null;
          }

          if (parsedJson && parsedJson.sections && Array.isArray(parsedJson.sections)) {
            // Use parsed sections as components and do not render iframe
            comps = parsedJson.sections.map((s, idx) => ({ id: `${s.type || 'section'}-${idx}`, type: s.type || 'textblock', props: s }));
            rawHtml = null;
          }
        }

        setHtmlContent(rawHtml);

        setComponents(comps);
        setHistory([JSON.parse(JSON.stringify(comps))]);
        setHistoryIndex(0);
      } catch (error) {
        console.error('Load editor failed', error);
        setComponents([]);
        setHistory([[]]);
        setHistoryIndex(0);
      }
    };

    loadEditor();
  }, [themeId]);

  const saveToHistory = useCallback((newComponents) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newComponents)));
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id.startsWith('library-')) {
      const componentType = active.id.replace('library-', '');
      const newComponent = createNewComponent(componentType);
      const newComponents = [...components, newComponent];
      setComponents(newComponents);
      saveToHistory(newComponents);
      return;
    }

    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newComponents = arrayMove(items, oldIndex, newIndex);
        saveToHistory(newComponents);
        return newComponents;
      });
    }
  };

  const createNewComponent = (type) => {
    const id = `${type}-${Date.now()}`;
    const templates = {
      hero: {
        id,
        type: 'hero',
        props: {
          title: 'New Hero Section',
          subtitle: 'Add your subtitle here',
          buttonText: 'Click Me',
          buttonLink: '#',
          bgColor: '#3b82f6',
          textColor: '#ffffff',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
        },
      },
      features: {
        id,
        type: 'features',
        props: {
          title: 'Features Section',
          items: [
            { icon: '⭐', title: 'Feature 1', description: 'Description here' },
            { icon: '🎯', title: 'Feature 2', description: 'Description here' },
            { icon: '🚀', title: 'Feature 3', description: 'Description here' },
          ],
          bgColor: '#f9fafb',
          textColor: '#111827',
        },
      },
      textblock: {
        id,
        type: 'textblock',
        props: {
          heading: 'Text Block Heading',
          content: 'Add your content here. This is a flexible text block that you can customize.',
          bgColor: '#ffffff',
          textColor: '#374151',
          alignment: 'left',
        },
      },
      footer: {
        id,
        type: 'footer',
        props: {
          companyName: 'Company Name',
          tagline: 'Your company tagline',
          links: [
            { text: 'Home', url: '#' },
            { text: 'About', url: '#' },
            { text: 'Contact', url: '#' },
          ],
          bgColor: '#1f2937',
          textColor: '#f3f4f6',
        },
      },
      navbar: {
        id,
        type: 'navbar',
        props: {
          logo: 'Logo',
          links: [
            { text: 'Home', url: '#' },
            { text: 'Products', url: '#' },
            { text: 'About', url: '#' },
            { text: 'Contact', url: '#' },
          ],
          bgColor: '#ffffff',
          textColor: '#1f2937',
        },
      },
    };
    return templates[type] || templates.textblock;
  };

  const updateComponent = (id, newProps) => {
    const newComponents = components.map((comp) =>
      comp.id === id ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    );
    setComponents(newComponents);
    saveToHistory(newComponents);
    // If the updated component is currently selected, update the selectedComponent state
    if (selectedComponent && selectedComponent.id === id) {
      const updated = newComponents.find((c) => c.id === id);
      if (updated) setSelectedComponent(updated);
    }
  };

  const deleteComponent = (id) => {
    const newComponents = components.filter((comp) => comp.id !== id);
    setComponents(newComponents);
    saveToHistory(newComponents);
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const duplicateComponent = (id) => {
    const component = components.find((comp) => comp.id === id);
    if (component) {
      const newComponent = {
        ...JSON.parse(JSON.stringify(component)),
        id: `${component.type}-${Date.now()}`,
      };
      const index = components.findIndex((comp) => comp.id === id);
      const newComponents = [
        ...components.slice(0, index + 1),
        newComponent,
        ...components.slice(index + 1),
      ];
      setComponents(newComponents);
      saveToHistory(newComponents);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setComponents(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setComponents(history[historyIndex + 1]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Build layout from components
      const layout = { sections: components.map((c) => ({ type: c.type, ...c.props })) };
      const storeId = localStorage.getItem('editorStoreId');
      if (!storeId) throw new Error('Missing storeId for save');

      const resp = await fetch(`/api/store/${storeId}/editor-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ layout, theme: { id: themeId }, products: {} })
      });
      if (!resp.ok) throw new Error('Save failed');
      const data = await resp.json();
      console.log('Save response', data);
      alert('Theme saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Unsaved changes will be lost.')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopBar
        storeName={storeName}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onExit={handleExit}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isSaving={isSaving}
      />
      {console.log('Navigating to editor with store name:', storeName)}

      <div className="flex-1 flex overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <ComponentLibrary />

          {htmlContent ? (
            // Render a sandboxed iframe for safer live preview. No scripts allowed.
            <div className="flex-1 bg-gray-50 overflow-hidden p-4">
              <div className="max-w-7xl mx-auto py-8">
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden h-full">
                  <iframe
                    title="Theme Preview"
                    sandbox=""
                    srcDoc={htmlContent}
                    style={{ width: '100%', height: '80vh', border: 'none' }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <Canvas
                components={components}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
                onUpdateComponent={updateComponent}
                onDeleteComponent={deleteComponent}
                onDuplicateComponent={duplicateComponent}
              />
            </SortableContext>
          )}

          <PropertiesPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={updateComponent}
            onClose={() => setSelectedComponent(null)}
          />
        </DndContext>
      </div>
    </div>
  );
};

export default Editor;
