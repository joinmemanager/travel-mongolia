import React from 'react';

import { cdnImage } from '@/lib/imageUrl';
import { SITE_URL } from '@/lib/seo';

// Contentful Rich Text-ийг энгийн HTML болгон харуулна (догол мөр, гарчиг, жагсаалт, ишлэл, холбоос,
// оруулсан зураг). Entry оруулгыг алгасна. Текст доторх мөр шилжилт (\n) <br> болно.
function renderText(value: string): React.ReactNode {
  if (!value.includes('\n')) return value;
  return value.split('\n').map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </React.Fragment>
  ));
}

// Сайтын доторх холбоос шинэ цонхонд нээгдэхгүй
function isInternal(uri: string): boolean {
  return uri.startsWith('/') || uri.startsWith(SITE_URL) || /^https?:\/\/(www\.)?travelhubmongolia\.com/.test(uri);
}

function renderNode(node: any, key: number): React.ReactNode {
  if (!node) return null;
  if (node.nodeType === 'text') {
    let el: React.ReactNode = renderText(node.value);
    for (const mark of node.marks || []) {
      if (mark.type === 'bold') el = <strong>{el}</strong>;
      if (mark.type === 'italic') el = <em>{el}</em>;
      if (mark.type === 'underline') el = <u>{el}</u>;
    }
    return <React.Fragment key={key}>{el}</React.Fragment>;
  }
  const children = (node.content || []).map((c: any, i: number) => renderNode(c, i));
  switch (node.nodeType) {
    case 'document':
      return <React.Fragment key={key}>{children}</React.Fragment>;
    case 'paragraph':
      return <p key={key} className="mb-4 text-base sm:text-lg leading-relaxed text-neutral-700">{children}</p>;
    case 'heading-1':
    case 'heading-2':
    case 'heading-3':
    case 'heading-4':
    case 'heading-5':
    case 'heading-6':
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
    case 'hyperlink': {
      const uri = String(node.data?.uri || '');
      const internal = isInternal(uri);
      return (
        <a
          key={key}
          href={internal ? uri.replace(/^https?:\/\/(www\.)?travelhubmongolia\.com/, '') || '/' : uri}
          {...(internal ? {} : { target: '_blank', rel: 'noreferrer' })}
          className="text-[#15803d] underline"
        >
          {children}
        </a>
      );
    }
    case 'embedded-asset-block': {
      // Contentful SDK холбоосыг задалсан бол fields.file байна; задлаагүй (нийтлэгдээгүй asset) бол алгасна
      const f = node.data?.target?.fields;
      const url: string | undefined = f?.file?.url;
      if (!url || !String(f.file.contentType || 'image/').startsWith('image/')) return null;
      const src = url.startsWith('//') ? `https:${url}` : url;
      const dims = f.file.details?.image;
      return (
        <figure key={key} className="my-8">
          <img
            src={cdnImage(src, 1200)}
            alt={f.title || ''}
            width={dims?.width}
            height={dims?.height}
            loading="lazy"
            className="w-full h-auto rounded-2xl bg-neutral-100"
          />
        </figure>
      );
    }
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
