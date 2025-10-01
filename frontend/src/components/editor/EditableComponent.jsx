import { useState, useRef, useEffect } from 'react';

const EditableText = ({ value, onChange, className, style, multiline = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} ${isEditing ? 'outline-2 outline-blue-500 outline-dashed' : 'cursor-text'}`}
      style={style}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      onPointerDown={(e) => {
        // prevent parent drag/select handlers from stealing focus
        e.stopPropagation();
      }}
      onBlur={handleBlur}
      onInput={(e) => setText(e.currentTarget.textContent)}
      onKeyDown={handleKeyDown}
    >
      {text}
    </div>
  );
};

const HeroComponent = ({ component, onUpdate }) => {
  const { title, subtitle, buttonText, bgColor, textColor, image } = component.props;

  return (
    <div
      className="relative min-h-96 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundColor: bgColor,
        backgroundImage: image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image})` : 'none',
      }}
    >
      <div className="text-center px-8 max-w-4xl">
        <EditableText
          value={title}
          onChange={(newTitle) => onUpdate(component.id, { title: newTitle })}
          className="text-5xl font-bold mb-4"
          style={{ color: textColor }}
        />
        <EditableText
          value={subtitle}
          onChange={(newSubtitle) => onUpdate(component.id, { subtitle: newSubtitle })}
          className="text-xl mb-8"
          style={{ color: textColor }}
        />
        <EditableText
          value={buttonText}
          onChange={(newButtonText) => onUpdate(component.id, { buttonText: newButtonText })}
          className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        />
      </div>
    </div>
  );
};

const FeaturesComponent = ({ component, onUpdate }) => {
  const { title, items, bgColor, textColor } = component.props;

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    onUpdate(component.id, { items: newItems });
  };

  return (
    <div className="py-16 px-8" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-6xl mx-auto">
        <EditableText
          value={title}
          onChange={(newTitle) => onUpdate(component.id, { title: newTitle })}
          className="text-4xl font-bold text-center mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <EditableText
                value={item.title}
                onChange={(newTitle) => updateItem(index, 'title', newTitle)}
                className="text-2xl font-semibold mb-2"
              />
              <EditableText
                value={item.description}
                onChange={(newDesc) => updateItem(index, 'description', newDesc)}
                className="text-gray-600"
                multiline
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TextBlockComponent = ({ component, onUpdate }) => {
  const { heading, content, bgColor, textColor, alignment } = component.props;

  return (
    <div className="py-12 px-8" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-4xl mx-auto" style={{ textAlign: alignment }}>
        <EditableText
          value={heading}
          onChange={(newHeading) => onUpdate(component.id, { heading: newHeading })}
          className="text-3xl font-bold mb-6"
        />
        <EditableText
          value={content}
          onChange={(newContent) => onUpdate(component.id, { content: newContent })}
          className="text-lg leading-relaxed"
          multiline
        />
      </div>
    </div>
  );
};

const FooterComponent = ({ component, onUpdate }) => {
  const { companyName, tagline, links, bgColor, textColor } = component.props;

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    onUpdate(component.id, { links: newLinks });
  };

  return (
    <div className="py-12 px-8" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-6xl mx-auto text-center">
        <EditableText
          value={companyName}
          onChange={(newName) => onUpdate(component.id, { companyName: newName })}
          className="text-2xl font-bold mb-2"
        />
        <EditableText
          value={tagline}
          onChange={(newTagline) => onUpdate(component.id, { tagline: newTagline })}
          className="text-sm mb-6 opacity-80"
        />
        <div className="flex justify-center gap-6 flex-wrap">
          {links.map((link, index) => (
            <EditableText
              key={index}
              value={link.text}
              onChange={(newText) => updateLink(index, 'text', newText)}
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const NavbarComponent = ({ component, onUpdate }) => {
  const { logo, links, bgColor, textColor } = component.props;

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    onUpdate(component.id, { links: newLinks });
  };

  return (
    <div className="py-4 px-8 shadow-md" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <EditableText
          value={logo}
          onChange={(newLogo) => onUpdate(component.id, { logo: newLogo })}
          className="text-2xl font-bold"
        />
        <div className="flex gap-6">
          {links.map((link, index) => (
            <EditableText
              key={index}
              value={link.text}
              onChange={(newText) => updateLink(index, 'text', newText)}
              className="hover:opacity-80 transition-opacity font-medium"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const EditableComponent = ({ component, onUpdate }) => {
  const componentMap = {
    hero: HeroComponent,
    features: FeaturesComponent,
    textblock: TextBlockComponent,
    footer: FooterComponent,
    navbar: NavbarComponent,
  };

  const Component = componentMap[component.type] || TextBlockComponent;

  return <Component component={component} onUpdate={onUpdate} />;
};

export default EditableComponent;
