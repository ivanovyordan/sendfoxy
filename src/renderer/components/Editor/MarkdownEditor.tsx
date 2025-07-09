import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import EditorToolbar, { ToolbarAction } from './EditorToolbar';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface MarkdownEditorHandle {
  handleToolbarAction: (action: ToolbarAction) => void;
}

const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(({ value, onChange }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts(textareaRef, onChange);

  // Toolbar action handler
  const handleToolbarAction = (action: ToolbarAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    let before = value.slice(0, start);
    let after = value.slice(end);
    let newValue = value;
    let insert = '';
    let cursorOffset = 0;

    switch (action) {
      case 'bold':
        insert = `**${selected || 'bold text'}**`;
        cursorOffset = selected ? 0 : 4;
        break;
      case 'italic':
        insert = `*${selected || 'italic text'}*`;
        cursorOffset = selected ? 0 : 6;
        break;
      case 'strikethrough':
        insert = `~~${selected || 'strikethrough'}~~`;
        cursorOffset = selected ? 0 : 6;
        break;
      case 'underline':
        insert = `<u>${selected || 'underline'}</u>`;
        cursorOffset = selected ? 0 : 9;
        break;
      case 'link':
        insert = `[${selected || 'link text'}](url)`;
        cursorOffset = selected ? 0 : 6;
        break;
      case 'code':
        insert = `\`${selected || 'code'}\``;
        cursorOffset = selected ? 0 : 2;
        break;
      case 'heading1':
        insert = `# ${selected || 'Heading 1'}`;
        cursorOffset = selected ? 0 : 9;
        break;
      case 'heading2':
        insert = `## ${selected || 'Heading 2'}`;
        cursorOffset = selected ? 0 : 10;
        break;
      case 'heading3':
        insert = `### ${selected || 'Heading 3'}`;
        cursorOffset = selected ? 0 : 11;
        break;
      case 'ul':
        insert = `- ${selected || 'List item'}`;
        cursorOffset = selected ? 0 : 9;
        break;
      case 'ol':
        insert = `1. ${selected || 'List item'}`;
        cursorOffset = selected ? 0 : 10;
        break;
      case 'quote':
        insert = `> ${selected || 'Blockquote'}`;
        cursorOffset = selected ? 0 : 11;
        break;
      case 'codeblock':
        insert = `\n\`\`\`\n${selected || 'code block'}\n\`\`\`\n`;
        cursorOffset = selected ? 0 : 10;
        break;
      case 'hr':
        insert = `\n---\n`;
        cursorOffset = 0;
        break;
      case 'image':
        insert = `![${selected || 'alt text'}](image-url)`;
        cursorOffset = selected ? 0 : 13;
        break;
      case 'table':
        insert = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`;
        cursorOffset = 0;
        break;
      default:
        break;
    }

    newValue = before + insert + after;
    onChange(newValue);
    setTimeout(() => {
      if (textarea) {
        const pos = before.length + insert.length - cursorOffset;
        textarea.focus();
        textarea.setSelectionRange(pos, pos);
      }
    }, 0);
  };

  useImperativeHandle(ref, () => ({
    handleToolbarAction,
  }));

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar onAction={handleToolbarAction} />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your markdown content here..."
        className="w-full h-full resize-none border-0 outline-none bg-transparent text-gray-900 placeholder-gray-500 font-mono text-sm leading-relaxed"
        style={{ fontFamily: 'Fira Code, monospace' }}
      />
    </div>
  );
});

export default MarkdownEditor;