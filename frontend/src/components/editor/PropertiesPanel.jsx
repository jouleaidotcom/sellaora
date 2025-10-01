const PropertiesPanel = ({ selectedComponent, onUpdateComponent, onClose }) => {
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
    const newArray = [...props[arrayKey]];
    newArray[index][field] = value;
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
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const renderTextInput = (label, value, key, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );

  const renderTextArea = (label, value, key, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows="4"
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelect = (label, value, key, options) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

  const propertiesMap = {
    hero: renderHeroProperties,
    features: renderFeaturesProperties,
    textblock: renderTextBlockProperties,
    footer: renderFooterProperties,
    navbar: renderNavbarProperties,
  };

  const renderProperties = propertiesMap[type] || renderTextBlockProperties;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Properties</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 font-medium">
            Component Type: <span className="uppercase">{type}</span>
          </p>
        </div>

        {renderProperties()}
      </div>
    </div>
  );
};

export default PropertiesPanel;
