import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/core';

type DropdownName = 'blockType' | 'color' | 'more';

const BLOCK_TYPES = [
  { label: 'Text',          shortLabel: 'T',  icon: 'fa-paragraph', command: (e: Editor) => e.chain().focus().setParagraph().run(),              isActive: (e: Editor) => e.isActive('paragraph') },
  { label: 'Heading 1',    shortLabel: 'H1', icon: 'fa-heading',    command: (e: Editor) => e.chain().focus().setHeading({ level: 1 }).run(),     isActive: (e: Editor) => e.isActive('heading', { level: 1 }) },
  { label: 'Heading 2',    shortLabel: 'H2', icon: 'fa-heading',    command: (e: Editor) => e.chain().focus().setHeading({ level: 2 }).run(),     isActive: (e: Editor) => e.isActive('heading', { level: 2 }) },
  { label: 'Heading 3',    shortLabel: 'H3', icon: 'fa-heading',    command: (e: Editor) => e.chain().focus().setHeading({ level: 3 }).run(),     isActive: (e: Editor) => e.isActive('heading', { level: 3 }) },
  { label: 'Bullet list',  shortLabel: '•—', icon: 'fa-list-ul',    command: (e: Editor) => e.chain().focus().toggleBulletList().run(),          isActive: (e: Editor) => e.isActive('bulletList') },
  { label: 'Numbered list',shortLabel: '1.', icon: 'fa-list-ol',    command: (e: Editor) => e.chain().focus().toggleOrderedList().run(),         isActive: (e: Editor) => e.isActive('orderedList') },
  { label: 'Blockquote',   shortLabel: '"',  icon: 'fa-quote-left', command: (e: Editor) => e.chain().focus().toggleBlockquote().run(),          isActive: (e: Editor) => e.isActive('blockquote') },
  { label: 'Code block',   shortLabel: '<>', icon: 'fa-file-code',  command: (e: Editor) => e.chain().focus().toggleCodeBlock().run(),           isActive: (e: Editor) => e.isActive('codeBlock') },
];

const TEXT_COLORS = [
  { label: 'Default', value: '#374151' },
  { label: 'Gray',    value: '#9CA3AF' },
  { label: 'Brown',   value: '#7C2D12' },
  { label: 'Orange',  value: '#EA580C' },
  { label: 'Yellow',  value: '#CA8A04' },
  { label: 'Green',   value: '#15803D' },
  { label: 'Blue',    value: '#1D4ED8' },
  { label: 'Purple',  value: '#7C3AED' },
  { label: 'Pink',    value: '#BE185D' },
  { label: 'Red',     value: '#DC2626' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Gray',   value: '#F3F4F6' },
  { label: 'Amber',  value: '#FEF3C7' },
  { label: 'Yellow', value: '#FEFCE8' },
  { label: 'Green',  value: '#DCFCE7' },
  { label: 'Blue',   value: '#DBEAFE' },
  { label: 'Purple', value: '#EDE9FE' },
  { label: 'Pink',   value: '#FCE7F3' },
  { label: 'Red',    value: '#FEE2E2' },
  { label: 'Teal',   value: '#CCFBF1' },
];

const Divider = () => <div className="w-px h-4 bg-gray-200 mx-0.5 shrink-0" />;

const BBtn: React.FC<{ onClick: () => void; active?: boolean; title: string; children: React.ReactNode }> = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    title={title}
    className={`bubble-btn ${active ? 'bubble-btn-active' : ''}`}
  >
    {children}
  </button>
);

const BubbleToolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  const toggle = (name: DropdownName) => setOpenDropdown(prev => prev === name ? null : name);

  const currentBlock = BLOCK_TYPES.find(t => t.isActive(editor))?.label ?? 'Text';
  const currentColor = editor.getAttributes('textStyle').color as string | undefined;

  const setLink = () => {
    const url = window.prompt('URL:', editor.getAttributes('link').href ?? '');
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div ref={toolbarRef} className="relative">
      {/* Main row */}
      <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-xl px-1 py-0.5 gap-0.5">
        {/* Block type */}
        <button
          type="button"
          onClick={() => toggle('blockType')}
          className={`bubble-btn gap-1 pr-2 text-xs font-medium min-w-14 justify-between ${openDropdown === 'blockType' ? 'bubble-btn-active' : ''}`}
        >
          <span>{currentBlock}</span>
          <i className="fas fa-chevron-down text-[9px] text-gray-400" />
        </button>
        <Divider />

        {/* Formatting */}
        <BBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (** **)">
          <strong>B</strong>
        </BBtn>
        <BBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (* *)">
          <em>I</em>
        </BBtn>
        <BBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <span className="underline">U</span>
        </BBtn>
        <BBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <s>S</s>
        </BBtn>
        <BBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <span className="font-mono text-xs">&lt;/&gt;</span>
        </BBtn>
        <Divider />

        {/* Link */}
        <BBtn onClick={setLink} active={editor.isActive('link')} title="Link">
          <i className="fas fa-link text-xs" />
        </BBtn>

        {/* Color (A▼) */}
        <button
          type="button"
          onClick={() => toggle('color')}
          title="Text & highlight color"
          className={`bubble-btn gap-0.5 ${openDropdown === 'color' ? 'bubble-btn-active' : ''}`}
        >
          <span
            className="font-bold text-sm"
            style={{ borderBottom: `3px solid ${currentColor ?? '#374151'}` }}
          >A</span>
          <i className="fas fa-chevron-down text-[9px] text-gray-400" />
        </button>

        {/* More (⋯) */}
        <button
          type="button"
          onClick={() => toggle('more')}
          title="More options"
          className={`bubble-btn ${openDropdown === 'more' ? 'bubble-btn-active' : ''}`}
        >
          <i className="fas fa-ellipsis text-xs" />
        </button>
      </div>

      {/* Block type dropdown */}
      {openDropdown === 'blockType' && (
        <div className="bubble-dropdown left-0 w-48">
          <p className="bubble-dropdown-heading">Turn into</p>
          {BLOCK_TYPES.map(type => (
            <button
              key={type.label}
              type="button"
              onMouseDown={e => { e.preventDefault(); type.command(editor); setOpenDropdown(null); }}
              className={`bubble-dropdown-item ${type.isActive(editor) ? 'text-primary-600 bg-primary-50' : ''}`}
            >
              <span className="w-6 text-center text-xs text-gray-400 font-mono shrink-0">{type.shortLabel}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Color dropdown */}
      {openDropdown === 'color' && (
        <div className="bubble-dropdown right-0 w-56 p-3">
          <p className="bubble-dropdown-heading mb-2">Text Color</p>
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
              title="Default"
              className="color-swatch text-gray-700 border-gray-200 hover:border-gray-400"
              style={{ backgroundColor: '#37415118' }}
            >
              A
            </button>
            {TEXT_COLORS.slice(1).map(c => (
              <button
                key={c.value}
                type="button"
                onMouseDown={e => { e.preventDefault(); editor.chain().focus().setColor(c.value).run(); }}
                title={c.label}
                className={`color-swatch ${currentColor === c.value ? 'border-gray-600' : 'border-transparent hover:border-gray-300'}`}
                style={{ color: c.value, backgroundColor: `${c.value}22` }}
              >
                A
              </button>
            ))}
          </div>

          <p className="bubble-dropdown-heading mb-2">Highlight Color</p>
          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); }}
              title="Remove highlight"
              className="color-swatch border-gray-200 hover:border-gray-400 text-gray-400 text-[10px]"
            >
              <i className="fas fa-xmark" />
            </button>
            {HIGHLIGHT_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHighlight({ color: c.value }).run(); }}
                title={c.label}
                className="color-swatch border-transparent hover:border-gray-300"
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>
      )}

      {/* More dropdown */}
      {openDropdown === 'more' && (
        <div className="bubble-dropdown right-0 p-1.5">
          <div className="flex items-center gap-0.5">
            <BBtn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Superscript">
              <span className="font-mono text-xs">X<sup>2</sup></span>
            </BBtn>
            <BBtn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Subscript">
              <span className="font-mono text-xs">X<sub>2</sub></span>
            </BBtn>
            <Divider />
            <BBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
              <i className="fas fa-align-left text-xs" />
            </BBtn>
            <BBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
              <i className="fas fa-align-center text-xs" />
            </BBtn>
            <BBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
              <i className="fas fa-align-right text-xs" />
            </BBtn>
            <BBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
              <i className="fas fa-align-justify text-xs" />
            </BBtn>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleToolbar;
