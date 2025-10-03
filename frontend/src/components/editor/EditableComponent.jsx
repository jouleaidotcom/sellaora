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

const NavbarComponent = ({ component, onUpdate, onNavigatePage }) => {
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
            <span
              key={index}
              className="hover:opacity-80 transition-opacity font-medium cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigatePage && (link.type === 'page' || link.pageName)) {
                  onNavigatePage(link.pageName || link.text);
                }
              }}
            >
              {link.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQComponent = ({ component, onUpdate }) => {
  const { title, items } = component.props;
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    onUpdate(component.id, { items: newItems });
  };
  return (
    <div className="bg-white p-8">
      <EditableText value={title} onChange={(v) => onUpdate(component.id, { title: v })} className="text-3xl font-bold mb-6" />
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="border rounded p-4">
            <EditableText value={it.question} onChange={(v) => updateItem(i, 'question', v)} className="font-semibold mb-2" />
            <EditableText value={it.answer} onChange={(v) => updateItem(i, 'answer', v)} className="text-gray-600" multiline />
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryComponent = ({ component, onUpdate }) => {
  const { title, images, columns } = component.props;
  return (
    <div className="bg-white p-8">
      <EditableText value={title} onChange={(v) => onUpdate(component.id, { title: v })} className="text-3xl font-bold mb-6" />
      <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr))` }}>
        {images.map((src, i) => (
          <img key={i} src={src} alt="gallery" className="w-full h-40 object-cover rounded" />
        ))}
      </div>
    </div>
  );
};

const NewsletterComponent = ({ component, onUpdate }) => {
  const { title, description, placeholder, ctaText } = component.props;
  return (
    <div className="bg-blue-50 p-8 text-center">
      <EditableText value={title} onChange={(v) => onUpdate(component.id, { title: v })} className="text-3xl font-bold mb-2" />
      <EditableText value={description} onChange={(v) => onUpdate(component.id, { description: v })} className="text-gray-600 mb-4" />
      <div className="flex justify-center gap-2">
        <input disabled className="px-3 py-2 border rounded w-64" placeholder={placeholder} />
        <button disabled className="px-4 py-2 bg-blue-600 text-white rounded">{ctaText}</button>
      </div>
    </div>
  );
};

const SimpleFormComponent = ({ component, onUpdate }) => {
  const { title, description } = component.props;
  return (
    <div className="bg-white p-8">
      <EditableText value={title} onChange={(v) => onUpdate(component.id, { title: v })} className="text-2xl font-bold mb-2" />
      {description && (
        <EditableText value={description} onChange={(v) => onUpdate(component.id, { description: v })} className="text-gray-600 mb-4" />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input disabled className="border rounded px-3 py-2" placeholder="Field 1" />
        <input disabled className="border rounded px-3 py-2" placeholder="Field 2" />
      </div>
      <button disabled className="mt-4 px-4 py-2 bg-gray-800 text-white rounded">Submit</button>
    </div>
  );
};

const CollectionComponent = ({ component, onUpdate }) => {
  const { title, items } = component.props;
  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    onUpdate(component.id, { items: newItems });
  };
  return (
    <div className="bg-white p-8">
      <EditableText value={title} onChange={(v) => onUpdate(component.id, { title: v })} className="text-3xl font-bold mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <div key={i} className="border rounded p-4">
            <img src={it.image} alt={it.title} className="w-full h-40 object-cover rounded mb-3" />
            <EditableText value={it.title} onChange={(v) => updateItem(i, 'title', v)} className="font-semibold" />
            <EditableText value={it.price} onChange={(v) => updateItem(i, 'price', v)} className="text-gray-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsComponent = ({ component, onUpdate }) => {
  const { title, items } = component.props;
  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    onUpdate(component.id, { items: newItems });
  };
  return (
    <div className="bg-white p-8">
      <EditableText value={title} onChange={(v) => onUpdate(component.id, { title: v })} className="text-3xl font-bold mb-6" />
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((it, i) => (
          <div key={i} className="border rounded p-4">
            <EditableText value={it.quote} onChange={(v) => updateItem(i, 'quote', v)} className="italic mb-2" />
            <EditableText value={it.author} onChange={(v) => updateItem(i, 'author', v)} className="text-gray-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

const PricingComponent = ({ component, onUpdate }) => {
  const { title, plans } = component.props;
  const updateFeature = (pi, fi, value) => {
    const newPlans = [...plans];
    newPlans[pi].features[fi] = value;
    onUpdate(component.id, { plans: newPlans });
  };
  return (
    <div className="bg-white p-8">
      <EditableText value={title} onChange={(v) => onUpdate(component.id, { title: v })} className="text-3xl font-bold mb-6 text-center" />
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((p, i) => (
          <div key={i} className="border rounded p-6 text-center">
            <EditableText value={p.name} onChange={(v) => {
              const np = [...plans]; np[i].name = v; onUpdate(component.id, { plans: np });
            }} className="text-xl font-semibold" />
            <EditableText value={p.price} onChange={(v) => { const np = [...plans]; np[i].price = v; onUpdate(component.id, { plans: np }); }} className="text-3xl font-bold my-2" />
            <ul className="text-left space-y-1">
              {p.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2">
                  <span>✔</span>
                  <EditableText value={f} onChange={(v) => updateFeature(i, fi, v)} className="flex-1" />
                </li>
              ))}
            </ul>
            <button disabled className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Choose</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CTAComponent = ({ component, onUpdate, onNavigatePage }) => {
  const { heading, subheading, buttonText } = component.props;
  return (
    <div className="bg-indigo-600 text-white text-center p-12">
      <EditableText value={heading} onChange={(v) => onUpdate(component.id, { heading: v })} className="text-4xl font-bold" />
      <EditableText value={subheading} onChange={(v) => onUpdate(component.id, { subheading: v })} className="opacity-90 mt-2" />
      <button
        className="mt-6 bg-white text-indigo-700 px-6 py-3 rounded font-semibold cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          const { linkType, pageName } = component.props;
          if (onNavigatePage && linkType === 'page' && pageName) onNavigatePage(pageName);
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

const DividerComponent = ({ component }) => {
  const { thickness, color } = component.props;
  return <div className="my-6" style={{ height: thickness, backgroundColor: color }} />;
};

const SpacerComponent = ({ component }) => {
  const { height } = component.props;
  return <div style={{ height }} />;
};

const ImageComponent = ({ component, onUpdate }) => {
  const { src, alt } = component.props;
  return (
    <div className="bg-white p-4 text-center">
      <img src={src} alt={alt} className="mx-auto rounded" />
      <EditableText value={alt} onChange={(v) => onUpdate(component.id, { alt: v })} className="text-sm text-gray-600 mt-2" />
    </div>
  );
};

const VideoComponent = ({ component }) => {
  const { url } = component.props;
  return (
    <div className="aspect-video">
      <iframe title="Video" src={url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  );
};

const ButtonComponent = ({ component, onUpdate, onNavigatePage }) => {
  const { text } = component.props;
  return (
    <div className="text-center p-4">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          const { linkType, pageName } = component.props;
          if (onNavigatePage && linkType === 'page' && pageName) onNavigatePage(pageName);
        }}
      >
        {text}
      </button>
    </div>
  );
};

const EditableComponent = ({ component, onUpdate, onNavigatePage }) => {
  const componentMap = {
    hero: HeroComponent,
    features: FeaturesComponent,
    textblock: TextBlockComponent,
    footer: FooterComponent,
    navbar: NavbarComponent,
    faq: FAQComponent,
    gallery: GalleryComponent,
    newsletter: NewsletterComponent,
    signup: SimpleFormComponent,
    login: SimpleFormComponent,
    waitlist: NewsletterComponent,
    contact: SimpleFormComponent,
    collection: CollectionComponent,
    testimonials: TestimonialsComponent,
    pricing: PricingComponent,
    cta: CTAComponent,
    divider: DividerComponent,
    spacer: SpacerComponent,
    image: ImageComponent,
    video: VideoComponent,
    button: ButtonComponent,
  };

  const Component = componentMap[component.type] || TextBlockComponent;

  return <Component component={component} onUpdate={onUpdate} onNavigatePage={onNavigatePage} />;
};

export default EditableComponent;
