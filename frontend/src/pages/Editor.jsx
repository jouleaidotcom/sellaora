import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const mockThemeData = {
      id: themeId || 'theme-1',
      components: [
        {
          id: 'hero-1',
          type: 'hero',
          props: {
            title: 'Welcome to Your Store',
            subtitle: 'Create amazing experiences with our platform',
            buttonText: 'Get Started',
            buttonLink: '#',
            bgColor: '#1e3a8a',
            textColor: '#ffffff',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
          },
        },
        {
          id: 'features-1',
          type: 'features',
          props: {
            title: 'Why Choose Us',
            items: [
              { icon: '⚡', title: 'Fast', description: 'Lightning-fast performance' },
              { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
              { icon: '💎', title: 'Premium', description: 'Top-quality service' },
            ],
            bgColor: '#ffffff',
            textColor: '#1f2937',
          },
        },
        {
          id: 'footer-1',
          type: 'footer',
          props: {
            companyName: 'Your Company',
            tagline: 'Building the future, one step at a time',
            links: [
              { text: 'About', url: '#about' },
              { text: 'Contact', url: '#contact' },
              { text: 'Privacy', url: '#privacy' },
            ],
            bgColor: '#111827',
            textColor: '#e5e7eb',
          },
        },
      ],
    };

    setComponents(mockThemeData.components);
    setHistory([mockThemeData.components]);
    setHistoryIndex(0);
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Saving theme:', { themeId, components });
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
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onExit={handleExit}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isSaving={isSaving}
      />

      <div className="flex-1 flex overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <ComponentLibrary />

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
