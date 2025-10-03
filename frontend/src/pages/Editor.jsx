import { useEffect, useState, useCallback } from 'react';
import PageTabs from '../components/editor/PageTabs';
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
  const [componentsByPage, setComponentsByPage] = useState({});
  const [pages, setPages] = useState([]); // [{id,name}]
  const [currentPage, setCurrentPage] = useState(0);
  const [htmlContent, setHtmlContent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [productList, setProductList] = useState([]);

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
        const incomingProducts = Array.isArray(payload.products) ? payload.products : [];
        setProductList(incomingProducts);

        // Attempt to use parsed layout -> components, otherwise default to empty
        let comps = [];
        const pageList = [];
        const byPage = {};
        try {
          const normalizeSection = (s, idx) => {
            const t = String(s.type || '').toLowerCase();
            const id = `${t || 'section'}-${idx}`;
            // Map AI/preview types into editor canonical shapes
            if (t === 'navbar') {
              return {
                id,
                type: 'navbar',
                props: {
                  logo: s.logo || 'Logo',
                  links: Array.isArray(s.links)
                    ? s.links.map(l => ({
                        text: l.text || 'Link',
                        type: l.type || (l.pageName ? 'page' : 'external'),
                        pageName: l.pageName || '',
                        url: l.url || (l.pageName ? '' : '#'),
                      }))
                    : [
                        { text: 'Home', type: 'page', pageName: 'Home' },
                        { text: 'Products', type: 'external', url: '#' },
                        { text: 'About', type: 'external', url: '#' },
                      ],
                  bgColor: s.bgColor || '#ffffff',
                  textColor: s.textColor || '#1f2937',
                }
              };
            }
            if (t === 'hero') {
              return {
                id,
                type: 'hero',
                props: {
                  title: s.title || 'New Hero Section',
                  subtitle: s.subtitle || 'Add your subtitle here',
                  buttonText: s.buttonText || 'Click Me',
                  buttonLink: s.buttonLink || '#',
                  bgColor: s.bgColor || '#3b82f6',
                  textColor: s.textColor || '#ffffff',
                  image: s.image || s.imageUrl || '',
                }
              };
            }
            if (t === 'features' || t === 'featuredproducts') {
              const items = Array.isArray(s.items) ? s.items : Array.isArray(s.features) ? s.features : [];
              return {
                id,
                type: 'features',
                props: {
                  title: s.title || 'Features Section',
                  items: (items.length ? items : [
                    { icon: '⭐', title: 'Feature 1', description: 'Description here' },
                    { icon: '🎯', title: 'Feature 2', description: 'Description here' },
                    { icon: '🚀', title: 'Feature 3', description: 'Description here' },
                  ]).map(it => ({ icon: it.icon || '⭐', title: it.title || 'Feature', description: it.description || 'Description here' })),
                  bgColor: s.bgColor || '#f9fafb',
                  textColor: s.textColor || '#111827',
                }
              };
            }
            if (t === 'footer') {
              return {
                id,
                type: 'footer',
                props: {
                  companyName: s.companyName || 'Company Name',
                  tagline: s.tagline || 'Your company tagline',
                  links: (Array.isArray(s.links) ? s.links : [
                    { text: 'Home', url: '#' },
                    { text: 'About', url: '#' },
                    { text: 'Contact', url: '#' },
                  ]).map(l => ({ text: l.text || 'Link', url: l.url || '#' })),
                  bgColor: s.bgColor || '#1f2937',
                  textColor: s.textColor || '#f3f4f6',
                }
              };
            }
            // default to textblock from common fields
            return {
              id,
              type: 'textblock',
              props: {
                heading: s.heading || s.title || 'Text Block Heading',
                content: s.content || s.text || 'Add your content here. This is a flexible text block that you can customize.',
                bgColor: s.bgColor || '#ffffff',
                textColor: s.textColor || '#374151',
                alignment: s.alignment || 'left',
              }
            };
          };

          if (payload.layout && Array.isArray(payload.layout.pages)) {
            payload.layout.pages.forEach((pg, pidx) => {
              const name = pg.name || `Page ${pidx + 1}`;
              pageList.push({ id: `page-${pidx}`, name });
              byPage[name] = Array.isArray(pg.sections) ? pg.sections.map((s, idx) => normalizeSection(s, idx)) : [];
            });
          } else if (payload.layout && Array.isArray(payload.layout.sections)) {
            // Single-page fallback
            comps = payload.layout.sections.map((s, idx) => normalizeSection(s, idx));
            pageList.push({ id: 'page-0', name: 'Home' });
            byPage['Home'] = comps;
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

        if (pageList.length) {
          setPages(pageList);
          setComponentsByPage(byPage);
          const initialName = pageList[0].name;
          const initialComps = byPage[initialName] || [];
          setComponents(initialComps);
          setHistory([JSON.parse(JSON.stringify(initialComps))]);
          setHistoryIndex(0);
          setCurrentPage(0);
        } else {
          setPages([{ id: 'page-0', name: 'Home' }]);
          setComponentsByPage({ Home: comps });
          setComponents(comps);
          setHistory([JSON.parse(JSON.stringify(comps))]);
          setHistoryIndex(0);
          setCurrentPage(0);
        }
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
    setIsDirty(true);
  }, [historyIndex]);

  // Page management
  const selectPage = (index) => {
    setCurrentPage(index);
    const name = pages[index]?.name;
    const comps = componentsByPage[name] || [];
    setComponents(comps);
    setSelectedComponent(null);
    setHistory([JSON.parse(JSON.stringify(comps))]);
    setHistoryIndex(0);
  };

  const addPage = () => {
    const name = `Page ${pages.length + 1}`;
    const newPages = [...pages, { id: `page-${Date.now()}`, name }];
    const newMap = { ...componentsByPage, [name]: [] };
    setPages(newPages);
    setComponentsByPage(newMap);
    selectPage(newPages.length - 1);
  };

  const renamePage = (index, newName) => {
    const oldName = pages[index].name;
    const updatedPages = pages.map((p, i) => (i === index ? { ...p, name: newName } : p));
    const mapCopy = { ...componentsByPage };
    mapCopy[newName] = mapCopy[oldName] || [];
    delete mapCopy[oldName];
    setPages(updatedPages);
    setComponentsByPage(mapCopy);
    if (currentPage === index) {
      setComponents(mapCopy[newName] || []);
    }
  };

  const deletePage = (index) => {
    if (pages.length <= 1) return;
    const name = pages[index].name;
    const updatedPages = pages.filter((_, i) => i !== index);
    const mapCopy = { ...componentsByPage };
    delete mapCopy[name];
    setPages(updatedPages);
    setComponentsByPage(mapCopy);
    const newIdx = Math.max(0, index - 1);
    selectPage(newIdx);
  };

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
      // New components
      faq: {
        id,
        type: 'faq',
        props: {
          title: 'Frequently Asked Questions',
          items: [
            { question: 'What is your return policy?', answer: '30 days return policy.' },
            { question: 'Do you ship internationally?', answer: 'Yes, worldwide.' },
          ],
        },
      },
      gallery: {
        id,
        type: 'gallery',
        props: {
          title: 'Image Gallery',
          columns: 3,
          images: [
            'https://picsum.photos/seed/1/400/300',
            'https://picsum.photos/seed/2/400/300',
            'https://picsum.photos/seed/3/400/300',
          ],
        },
      },
      newsletter: {
        id,
        type: 'newsletter',
        props: {
          title: 'Join our newsletter',
          description: 'Get updates in your inbox.',
          placeholder: 'you@example.com',
          ctaText: 'Subscribe',
        },
      },
      signup: {
        id,
        type: 'signup',
        props: {
          title: 'Create an account',
          description: 'Sign up to start shopping.',
        },
      },
      login: {
        id,
        type: 'login',
        props: {
          title: 'Welcome back',
        },
      },
      waitlist: {
        id,
        type: 'waitlist',
        props: {
          title: 'Join the waitlist',
          description: 'Be the first to know.',
          placeholder: 'you@example.com',
          ctaText: 'Notify me',
        },
      },
      contact: {
        id,
        type: 'contact',
        props: {
          title: 'Contact us',
          description: 'We usually reply within 24 hours.',
        },
      },
      collection: {
        id,
        type: 'collection',
        props: {
          title: 'Our Collection',
          items: [
            { title: 'Product 1', price: '$19', image: 'https://picsum.photos/seed/p1/300/200' },
            { title: 'Product 2', price: '$29', image: 'https://picsum.photos/seed/p2/300/200' },
            { title: 'Product 3', price: '$39', image: 'https://picsum.photos/seed/p3/300/200' },
          ],
        },
      },
      testimonials: {
        id,
        type: 'testimonials',
        props: {
          title: 'What customers say',
          items: [
            { quote: 'Amazing products!', author: 'Alex' },
            { quote: 'Great support and fast delivery.', author: 'Sam' },
          ],
        },
      },
      pricing: {
        id,
        type: 'pricing',
        props: {
          title: 'Pricing',
          plans: [
            { name: 'Basic', price: '$9', features: ['Feature A', 'Feature B'] },
            { name: 'Pro', price: '$29', features: ['Everything in Basic', 'Feature C'] },
          ],
        },
      },
      cta: {
        id,
        type: 'cta',
        props: {
          heading: 'Ready to get started?',
          subheading: 'Join us today',
          buttonText: 'Get started',
          linkType: 'external',
          buttonLink: '#',
          pageName: '',
        },
      },
      divider: {
        id,
        type: 'divider',
        props: { thickness: 2, color: '#e5e7eb' },
      },
      spacer: {
        id,
        type: 'spacer',
        props: { height: 32 },
      },
      image: {
        id,
        type: 'image',
        props: { src: 'https://picsum.photos/seed/solo/800/400', alt: 'Image' },
      },
      video: {
        id,
        type: 'video',
        props: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      },
      button: {
        id,
        type: 'button',
        props: { text: 'Click me', linkType: 'external', link: '#', pageName: '', variant: 'primary' },
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
      // Build layout from pages
      let layout;
      if (pages.length > 1) {
        layout = {
          pages: pages.map((p) => ({ name: p.name, sections: (componentsByPage[p.name] || []).map((c) => ({ type: c.type, ...c.props })) })),
        };
      } else {
        layout = { sections: components.map((c) => ({ type: c.type, ...c.props })) };
      }
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
      setIsDirty(false);
      alert('Theme saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExit = () => {
    if (!isDirty || window.confirm('Are you sure you want to exit? Unsaved changes will be lost.')) {
      navigate('/dashboard');
    }
  };

  // Warn on browser/tab close when there are unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

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

      <PageTabs
        pages={pages}
        currentIndex={currentPage}
        onSelect={selectPage}
        onAdd={addPage}
        onRename={renamePage}
        onDelete={deletePage}
      />

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
                onNavigatePage={(name) => {
                  if (!name) return;
                  const idx = pages.findIndex((p) => p.name === name);
                  if (idx >= 0) {
                    selectPage(idx);
                  } else {
                    // create the page if it doesn't exist
                    const newPages = [...pages, { id: `page-${Date.now()}`, name }];
                    const newMap = { ...componentsByPage, [name]: [] };
                    setPages(newPages);
                    setComponentsByPage(newMap);
                    setTimeout(() => selectPage(newPages.length - 1), 0);
                  }
                }}
              />
            </SortableContext>
          )}

          <PropertiesPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={updateComponent}
                onDeleteComponent={deleteComponent}
                onDuplicateComponent={duplicateComponent}
                onClose={() => setSelectedComponent(null)}
                pages={pages}
                products={productList}
              />
        </DndContext>
      </div>
    </div>
  );
};

export default Editor;
