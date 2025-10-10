const PropertiesPanel = ({ selectedComponent, onUpdateComponent, onDeleteComponent, onDuplicateComponent, onClose, pages = [], products = [] }) => {
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex-shrink-0">
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg font-semibold mb-2">No component selected</p>
          <p className="text-sm">Click on a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const { id, type, props } = selectedComponent;

  const handleChange = (key, value) => {
    onUpdateComponent(id, { [key]: value });
  };

  const handleArrayItemChange = (arrayKey, index, field, value) => {
    const newArray = Array.isArray(props[arrayKey]) ? [...props[arrayKey]] : [];
    if (typeof newArray[index] === 'object' && newArray[index] !== null && field) {
      newArray[index][field] = value;
    } else {
      newArray[index] = value;
    }
    onUpdateComponent(id, { [arrayKey]: newArray });
  };

  const addArrayItem = (arrayKey, template) => {
    const newArray = [...props[arrayKey], template];
    onUpdateComponent(id, { [arrayKey]: newArray });
  };

  const removeArrayItem = (arrayKey, index) => {
    const newArray = props[arrayKey].filter((_, i) => i !== index);
    onUpdateComponent(id, { [arrayKey]: newArray });
  };

  const renderColorPicker = (label, value, key) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-12 h-10 rounded border border-neutral-700 cursor-pointer bg-neutral-900"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="flex-1 px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-100 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const renderTextInput = (label, value, key, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-100 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500"
        placeholder={placeholder}
      />
    </div>
  );

  const renderTextArea = (label, value, key, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-100 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500"
        rows="4"
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelect = (label, value, key, options) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-100 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderHeroProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title', 'Enter hero title')}
      {renderTextInput('Subtitle', props.subtitle, 'subtitle', 'Enter hero subtitle')}
      {renderTextInput('Button Text', props.buttonText, 'buttonText', 'Button text')}
      {renderTextInput('Button Link', props.buttonLink, 'buttonLink', 'https://...')}
      {renderTextInput('Background Image URL', props.image, 'image', 'https://...')}
      {renderColorPicker('Background Color', props.bgColor, 'bgColor')}
      {renderColorPicker('Text Color', props.textColor, 'textColor')}
    </>
  );

  const renderFeaturesProperties = () => (
    <>
      {renderTextInput('Section Title', props.title, 'title', 'Enter section title')}
      {renderColorPicker('Background Color', props.bgColor, 'bgColor')}
      {renderColorPicker('Text Color', props.textColor, 'textColor')}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        {props.items.map((item, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Feature {index + 1}</span>
              <button
                onClick={() => removeArrayItem('items', index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={item.icon}
              onChange={(e) => handleArrayItemChange('items', index, 'icon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
              placeholder="Icon (emoji)"
            />
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleArrayItemChange('items', index, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
              placeholder="Title"
            />
            <textarea
              value={item.description}
              onChange={(e) => handleArrayItemChange('items', index, 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows="2"
              placeholder="Description"
            />
          </div>
        ))}
        <button
          onClick={() =>
            addArrayItem('items', { icon: '⭐', title: 'New Feature', description: 'Description' })
          }
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Feature
        </button>
      </div>
    </>
  );

  const renderTextBlockProperties = () => (
    <>
      {renderTextInput('Heading', props.heading, 'heading', 'Enter heading')}
      {renderTextArea('Content', props.content, 'content', 'Enter content')}
      {renderColorPicker('Background Color', props.bgColor, 'bgColor')}
      {renderColorPicker('Text Color', props.textColor, 'textColor')}
      {renderSelect('Alignment', props.alignment, 'alignment', [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ])}
    </>
  );

  // Generic fallback editor for unknown component types
  const renderGenericProperties = () => {
    // Heuristics: expose common fields if present
    const common = [
      ['title', 'Title'],
      ['heading', 'Heading'],
      ['subtitle', 'Subtitle'],
      ['subheading', 'Subheading'],
      ['description', 'Description'],
      ['content', 'Content'],
      ['buttonText', 'Button Text'],
      ['bgColor', 'Background Color', 'color'],
      ['textColor', 'Text Color', 'color'],
      ['image', 'Image URL'],
      ['imageUrl', 'Image URL'],
      ['backgroundUrl', 'Background URL'],
    ];

    const renderCommonField = ([key, label, kind]) => {
      const val = props[key];
      if (val === undefined) return null;
      if (kind === 'color' || (typeof val === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(val))) {
        return renderColorPicker(label, val, key);
      }
      if (typeof val === 'string') {
        return renderTextInput(label, val, key);
      }
      return null;
    };

    return (
      <>
        {common.map(renderCommonField)}
        {/* Items/images quick editor when they are simple arrays */}
        {Array.isArray(props.items) && typeof props.items[0] === 'string' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            {props.items.map((v, i) => (
              <input key={i} type="text" value={v} onChange={(e) => handleArrayItemChange('items', i, undefined, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
            ))}
            <button onClick={() => addArrayItem('items', 'New item')} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Item</button>
          </div>
        )}

        {Array.isArray(props.images) && typeof props.images[0] === 'string' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            {props.images.map((v, i) => (
              <input key={i} type="text" value={v} onChange={(e) => handleArrayItemChange('images', i, undefined, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
            ))}
            <button onClick={() => addArrayItem('images', 'https://picsum.photos/seed/new/400/300')} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Image</button>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Advanced (JSON)</label>
          <textarea
            value={JSON.stringify(props, null, 2)}
            onChange={(e) => {
              try {
                const obj = JSON.parse(e.target.value);
                // Apply a shallow merge
                Object.keys(obj).forEach((k) => handleChange(k, obj[k]));
              } catch {}
            }}
            className="w-full px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-100 rounded"
            rows="10"
          />
        </div>
      </>
    );
  };

  const renderFooterProperties = () => (
    <>
      {renderTextInput('Company Name', props.companyName, 'companyName', 'Your company')}
      {renderTextInput('Tagline', props.tagline, 'tagline', 'Company tagline')}
      {renderColorPicker('Background Color', props.bgColor, 'bgColor')}
      {renderColorPicker('Text Color', props.textColor, 'textColor')}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
        {props.links.map((link, index) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Link {index + 1}</span>
              <button
                onClick={() => removeArrayItem('links', index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={link.text}
              onChange={(e) => handleArrayItemChange('links', index, 'text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
              placeholder="Link text"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => handleArrayItemChange('links', index, 'url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="URL"
            />
          </div>
        ))}
        <button
          onClick={() => addArrayItem('links', { text: 'New Link', url: '#' })}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Link
        </button>
      </div>
    </>
  );

  const renderNavbarProperties = () => (
    <>
      {renderTextInput('Logo', props.logo, 'logo', 'Logo text')}
      {renderColorPicker('Background Color', props.bgColor, 'bgColor')}
      {renderColorPicker('Text Color', props.textColor, 'textColor')}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Links</label>
        {props.links.map((link, index) => {
          const type = link.type || (link.pageName ? 'page' : 'external');
          return (
            <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Link {index + 1}</span>
                <button onClick={() => removeArrayItem('links', index)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
              </div>
              <input
                type="text"
                value={link.text}
                onChange={(e) => handleArrayItemChange('links', index, 'text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                placeholder="Link text"
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={type}
                  onChange={(e) => handleArrayItemChange('links', index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="page">Page</option>
                  <option value="external">External URL</option>
                </select>
                {type === 'page' ? (
                  <select
                    value={link.pageName || ''}
                    onChange={(e) => handleArrayItemChange('links', index, 'pageName', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select page</option>
                    {pages.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => handleArrayItemChange('links', index, 'url', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded"
                    placeholder="https://..."
                  />
                )}
              </div>
            </div>
          );
        })}
        <button
          onClick={() => addArrayItem('links', { text: 'New Link', type: 'page', pageName: (pages[0]?.name || '') })}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Link
        </button>
      </div>
    </>
  );

  const renderFAQProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title', 'FAQ title')}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
        {props.items.map((qa, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Item {index + 1}</span>
              <button onClick={() => removeArrayItem('items', index)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
            </div>
            <input type="text" value={qa.question} onChange={(e) => handleArrayItemChange('items', index, 'question', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" placeholder="Question" />
            <textarea value={qa.answer} onChange={(e) => handleArrayItemChange('items', index, 'answer', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" rows="3" placeholder="Answer" />
          </div>
        ))}
        <button onClick={() => addArrayItem('items', { question: 'New question?', answer: 'Answer here.' })} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add QA</button>
      </div>
    </>
  );

  const renderGalleryProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title', 'Gallery title')}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
        <input type="number" value={props.columns} onChange={(e) => handleChange('columns', parseInt(e.target.value || '1', 10))} className="w-full px-3 py-2 border border-gray-300 rounded" min="1" max="6" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        {props.images.map((src, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="text" value={src} onChange={(e) => handleArrayItemChange('images', index, undefined, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded" placeholder="https://..." />
            <button onClick={() => removeArrayItem('images', index)} className="px-3 py-2 text-sm bg-red-600 text-white rounded">Remove</button>
          </div>
        ))}
        <button onClick={() => addArrayItem('images', 'https://picsum.photos/seed/new/400/300')} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Image</button>
      </div>
    </>
  );

  const renderNewsletterProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title')}
      {renderTextInput('Description', props.description, 'description')}
      {renderTextInput('Placeholder', props.placeholder, 'placeholder')}
      {renderTextInput('CTA Text', props.ctaText, 'ctaText')}
    </>
  );

  const renderSimpleFormProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title')}
      {renderTextInput('Description', props.description, 'description')}
    </>
  );

  const renderCollectionProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title')}

      {/* Add from Products */}
      <div className="mb-4 p-3 bg-gray-50 rounded border">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Add products</label>
          <span className="text-xs text-gray-500">{products.length} available</span>
        </div>
        <div className="max-h-40 overflow-auto space-y-2">
          {products.map((p) => (
            <div key={p._id} className="flex items-center justify-between text-sm">
              <div className="truncate">{p.name}</div>
              <button
                onClick={() => {
                  const template = { productId: p._id, title: p.name, price: p.price ? `$${p.price}` : '', image: p.image || '' };
                  addArrayItem('items', template);
                }}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-xs text-gray-500">No products yet. Add them from Dashboard → Products.</div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
        {props.items.map((item, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Item {index + 1}</span>
              <button onClick={() => removeArrayItem('items', index)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
            </div>
            <input type="text" value={item.title} onChange={(e) => handleArrayItemChange('items', index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" placeholder="Title" />
            <input type="text" value={item.price} onChange={(e) => handleArrayItemChange('items', index, 'price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" placeholder="Price" />
            <input type="text" value={item.image} onChange={(e) => handleArrayItemChange('items', index, 'image', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Image URL" />
          </div>
        ))}
        <button onClick={() => addArrayItem('items', { title: 'New', price: '$0', image: 'https://picsum.photos/seed/new/300/200' })} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Item</button>
      </div>
    </>
  );

  const renderTestimonialsProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title')}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Testimonials</label>
        {props.items.map((item, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Item {index + 1}</span>
              <button onClick={() => removeArrayItem('items', index)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
            </div>
            <textarea value={item.quote} onChange={(e) => handleArrayItemChange('items', index, 'quote', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" rows="2" placeholder="Quote" />
            <input type="text" value={item.author} onChange={(e) => handleArrayItemChange('items', index, 'author', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Author" />
          </div>
        ))}
        <button onClick={() => addArrayItem('items', { quote: 'New quote', author: 'Author' })} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Testimonial</button>
      </div>
    </>
  );

  const renderPricingProperties = () => (
    <>
      {renderTextInput('Title', props.title, 'title')}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Plans</label>
        {props.plans.map((plan, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Plan {index + 1}</span>
              <button onClick={() => removeArrayItem('plans', index)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
            </div>
            <input type="text" value={plan.name} onChange={(e) => handleArrayItemChange('plans', index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" placeholder="Name" />
            <input type="text" value={plan.price} onChange={(e) => handleArrayItemChange('plans', index, 'price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" placeholder="Price" />
            <div>
              <label className="block text-xs text-gray-600 mb-1">Features</label>
              {plan.features.map((f, fi) => (
                <input key={fi} type="text" value={f} onChange={(e) => {
                  const arr = [...props.plans[index].features];
                  arr[fi] = e.target.value;
                  const newPlans = [...props.plans];
                  newPlans[index] = { ...newPlans[index], features: arr };
                  onUpdateComponent(id, { plans: newPlans });
                }} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" placeholder="Feature" />
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => addArrayItem('plans', { name: 'New Plan', price: '$0', features: ['Feature'] })} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Plan</button>
      </div>
    </>
  );

  const renderCTAProperties = () => (
    <>
      {renderTextInput('Heading', props.heading, 'heading')}
      {renderTextInput('Subheading', props.subheading, 'subheading')}
      {renderTextInput('Button Text', props.buttonText, 'buttonText')}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <select
          value={props.linkType || 'external'}
          onChange={(e) => handleChange('linkType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="page">Page</option>
          <option value="external">External URL</option>
        </select>
        {(props.linkType || 'external') === 'page' ? (
          <select
            value={props.pageName || ''}
            onChange={(e) => handleChange('pageName', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select page</option>
            {pages.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={props.buttonLink || ''}
            onChange={(e) => handleChange('buttonLink', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            placeholder="https://..."
          />
        )}
      </div>
    </>
  );

  const renderDividerProperties = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Thickness</label>
        <input type="number" value={props.thickness} onChange={(e) => handleChange('thickness', parseInt(e.target.value || '1', 10))} className="w-full px-3 py-2 border border-gray-300 rounded" />
      </div>
      {renderColorPicker('Color', props.color, 'color')}
    </>
  );

  const renderSpacerProperties = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
        <input type="number" value={props.height} onChange={(e) => handleChange('height', parseInt(e.target.value || '0', 10))} className="w-full px-3 py-2 border border-gray-300 rounded" />
      </div>
    </>
  );

  const renderImageProperties = () => (
    <>
      {renderTextInput('Image URL', props.src, 'src')}
      {renderTextInput('Alt text', props.alt, 'alt')}
    </>
  );

  const renderVideoProperties = () => (
    <>
      {renderTextInput('Embed URL', props.url, 'url')}
    </>
  );

  const renderButtonProperties = () => (
    <>
      {renderTextInput('Text', props.text, 'text')}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <select
          value={props.linkType || 'external'}
          onChange={(e) => handleChange('linkType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="page">Page</option>
          <option value="external">External URL</option>
        </select>
        {(props.linkType || 'external') === 'page' ? (
          <select
            value={props.pageName || ''}
            onChange={(e) => handleChange('pageName', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select page</option>
            {pages.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={props.link || ''}
            onChange={(e) => handleChange('link', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            placeholder="https://..."
          />
        )}
      </div>
      {renderSelect('Variant', props.variant, 'variant', [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
      ])}
    </>
  );

  const propertiesMap = {
    hero: renderHeroProperties,
    features: renderFeaturesProperties,
    textblock: renderTextBlockProperties,
    footer: renderFooterProperties,
    navbar: renderNavbarProperties,
    faq: renderFAQProperties,
    gallery: renderGalleryProperties,
    newsletter: renderNewsletterProperties,
    signup: renderSimpleFormProperties,
    login: renderSimpleFormProperties,
    waitlist: renderNewsletterProperties,
    contact: renderSimpleFormProperties,
    collection: renderCollectionProperties,
    testimonials: renderTestimonialsProperties,
    pricing: renderPricingProperties,
    cta: renderCTAProperties,
    divider: renderDividerProperties,
    spacer: renderSpacerProperties,
    image: renderImageProperties,
    video: renderVideoProperties,
    button: renderButtonProperties,
  };

  const renderProperties = propertiesMap[type] || renderGenericProperties;

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex-shrink-0 overflow-y-auto text-neutral-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-neutral-100">Properties</h2>
          <div className="flex items-center gap-2">
            {selectedComponent && (
              <>
                <button
                  onClick={() => onDuplicateComponent && onDuplicateComponent(selectedComponent.id)}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                  title="Duplicate"
                >
                  Copy
                </button>
                <button
                  onClick={() => onDeleteComponent && onDeleteComponent(selectedComponent.id)}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                  title="Delete"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mb-4 p-3 bg-emerald-900/30 rounded-lg border border-emerald-800">
          <p className="text-xs text-emerald-300 font-medium">
            Component Type: <span className="uppercase">{type}</span>
          </p>
        </div>

        {renderProperties()}
      </div>
    </div>
  );
};

export default PropertiesPanel;
