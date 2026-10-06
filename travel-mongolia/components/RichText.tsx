import React from 'react';

// Contentful Rich Text-ийг энгийн HTML болгон харуулна (догол мөр, гарчиг, жагсаалт, ишлэл, холбоос).
// Зураг, entry оруулга зэргийг алгасна.
function renderNode(node: any, key: number): React.ReactNode {
  if (!node) return null;
  if (node.nodeType === 'text') {
    let el: React.ReactNode = node.value;
    for (const mark of node.marks || []) {
      if (mark.type === 'bold') el = <strong>{el}</strong>;
      if (mark.type === 'italic') el = <em>{el}</em>;
    }
    return <React.Fragment key={key}>{el}</React.Fragment>;
  }
  const children = (node.content || []).map((c: any, i: number) => renderNode(c, i));
  switch (node.nodeType) {
    case 'document':
      return <React.Fragment key={key}>{children}</React.Fragment>;
    case 'paragraph':
      return <p key={key} className="mb-4 text-base sm:text-lg leading-relaxed text-neutral-700">{children}</p>;
    case 'heading-2':
    case 'heading-3':
    case 'heading-4':
      return <h3 key={key} className="mt-8 mb-3 text-xl font-black text-neutral-900">{children}</h3>;
    case 'unordered-list':
      return <ul key={key} className="mb-4 space-y-2 list-disc pl-6 text-neutral-700">{children}</ul>;
    case 'ordered-list':
      return <ol key={key} className="mb-4 space-y-2 list-decimal pl-6 text-neutral-700">{children}</ol>;
    case 'list-item':
      return <li key={key}>{children}</li>;
    case 'blockquote':
      return <blockquote key={key} className="my-6 pl-4 border-l-4 border-[#15803d] italic text-neutral-700">{children}</blockquote>;
    case 'hr':
      return <hr key={key} className="my-8 border-neutral-200" />;
    case 'hyperlink':
      return (
        <a key={key} href={node.data?.uri} target="_blank" rel="noreferrer" className="text-[#15803d] underline">
          {children}
        </a>
      );
    default:
      return null;
  }
}

export default function RichText({ document }: { document: any }) {
  if (!document) return null;
  if (typeof document === 'string') {
    return <p className="mb-4 text-base sm:text-lg leading-relaxed whitespace-pre-line text-neutral-700">{document}</p>;
  }
  return <>{renderNode(document, 0)}</>;
}
