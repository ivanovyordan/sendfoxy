import React, { useRef } from 'react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts(textareaRef, onChange);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your markdown content here..."
      className="w-full h-full resize-none border-0 outline-none bg-transparent text-gray-900 placeholder-gray-500 font-mono text-sm leading-relaxed"
      style={{ fontFamily: 'Fira Code, monospace' }}
    />
  );
};

export default MarkdownEditor;