import React from 'react';

interface EditorToolbarProps {
  onAction: (action: ToolbarAction) => void;
}

export type ToolbarAction =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'underline'
  | 'link'
  | 'code'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'ul'
  | 'ol'
  | 'quote'
  | 'codeblock'
  | 'hr'
  | 'image'
  | 'table';

const buttons: { action: ToolbarAction; icon: string; label: string }[] = [
  { action: 'bold', icon: 'fa-bold', label: 'Bold' },
  { action: 'italic', icon: 'fa-italic', label: 'Italic' },
  { action: 'strikethrough', icon: 'fa-strikethrough', label: 'Strikethrough' },
  { action: 'underline', icon: 'fa-underline', label: 'Underline' },
  { action: 'link', icon: 'fa-link', label: 'Link' },
  { action: 'code', icon: 'fa-code', label: 'Inline Code' },
  { action: 'heading1', icon: 'fa-heading', label: 'Heading 1' },
  { action: 'heading2', icon: 'fa-heading', label: 'Heading 2' },
  { action: 'heading3', icon: 'fa-heading', label: 'Heading 3' },
  { action: 'ul', icon: 'fa-list-ul', label: 'Bullet List' },
  { action: 'ol', icon: 'fa-list-ol', label: 'Numbered List' },
  { action: 'quote', icon: 'fa-quote-left', label: 'Blockquote' },
  { action: 'codeblock', icon: 'fa-file-code', label: 'Code Block' },
  { action: 'hr', icon: 'fa-minus', label: 'Horizontal Rule' },
  { action: 'image', icon: 'fa-image', label: 'Image' },
  { action: 'table', icon: 'fa-table', label: 'Table' },
];

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onAction }) => {
  return (
    <div className="flex flex-wrap gap-1 items-center border-b border-gray-200 bg-gray-50 px-2 py-1 rounded-t-lg">
      {buttons.map(({ action, icon, label }) => (
        <button
          key={action}
          type="button"
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
          title={label}
          aria-label={label}
          onClick={() => onAction(action)}
        >
          <i className={`fas ${icon}`}></i>
        </button>
      ))}
    </div>
  );
};

export default EditorToolbar;