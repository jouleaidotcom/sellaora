const TextBlock = ({ section }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">{section.heading || 'Text Heading'}</h3>
      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{section.body || 'Text content...'}</p>
    </div>
  );
};

export default TextBlock;


