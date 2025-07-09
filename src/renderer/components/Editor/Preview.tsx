import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  html: string;
  viewMode: 'preview' | 'html';
}

const Preview: React.FC<PreviewProps> = ({ html, viewMode }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && viewMode === 'preview') {
      // Add click handlers to all links in the preview
      const links = previewRef.current.querySelectorAll('a[href]');
      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = (link as HTMLAnchorElement).href;
          window.electronAPI.openExternal(url);
        });
      });
    }
  }, [html, viewMode]);

  if (viewMode === 'html') {
    return (
      <pre className="w-full h-full overflow-auto bg-gray-900 text-green-400 p-4 text-sm font-mono whitespace-pre-wrap">
        {html}
      </pre>
    );
  }

  return (
    <div
      ref={previewRef}
      className="w-full h-full overflow-auto prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Preview;