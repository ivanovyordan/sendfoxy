import React from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import SlashCommandsList, { SlashCommand, SlashCommandsListRef } from './SlashCommandsList';

interface RichEditorProps {
  onHtmlChange: (html: string) => void;
}

const COMMANDS: SlashCommand[] = [
  { title: 'Text', description: 'Plain paragraph', icon: 'fa-paragraph', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run() },
  { title: 'Heading 1', description: 'Large heading', icon: 'fa-heading', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run() },
  { title: 'Heading 2', description: 'Medium heading', icon: 'fa-heading', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run() },
  { title: 'Heading 3', description: 'Small heading', icon: 'fa-heading', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run() },
  { title: 'Bullet list', description: 'Unordered list', icon: 'fa-list-ul', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: 'Numbered list', description: 'Ordered list', icon: 'fa-list-ol', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: 'Blockquote', description: 'Quote block', icon: 'fa-quote-left', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
  { title: 'Code block', description: 'Code snippet', icon: 'fa-file-code', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
  { title: 'Divider', description: 'Horizontal line', icon: 'fa-minus', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
];

const SlashCommands = Extension.create({
  name: 'slashCommands',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        items: ({ query }: { query: string }) =>
          COMMANDS.filter(c => c.title.toLowerCase().includes(query.toLowerCase())),
        render: () => {
          let renderer: ReactRenderer<SlashCommandsListRef>;
          let container: HTMLDivElement;

          return {
            onStart(props) {
              container = document.createElement('div');
              container.style.cssText = 'position:fixed;z-index:9999;';
              document.body.appendChild(container);

              renderer = new ReactRenderer(SlashCommandsList, {
                props,
                editor: props.editor,
              });
              container.appendChild(renderer.element);

              const rect = props.clientRect?.();
              if (rect) {
                container.style.top = `${rect.bottom + 4}px`;
                container.style.left = `${rect.left}px`;
              }
            },
            onUpdate(props) {
              renderer.updateProps(props);
              const rect = props.clientRect?.();
              if (rect) {
                container.style.top = `${rect.bottom + 4}px`;
                container.style.left = `${rect.left}px`;
              }
            },
            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                container.remove();
                renderer.destroy();
                return true;
              }
              return renderer.ref?.onKeyDown(props) ?? false;
            },
            onExit() {
              container.remove();
              renderer.destroy();
            },
          };
        },
        command: ({ editor, range, props }) => {
          (props as SlashCommand).command({ editor, range });
        },
      }),
    ];
  },
});

const BubbleButton: React.FC<{ onClick: () => void; active: boolean; icon: string; title: string }> = ({ onClick, active, icon, title }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    title={title}
    className={`px-2 py-1 text-sm transition-colors ${active ? 'text-primary-400' : 'text-gray-200 hover:text-white'}`}
  >
    <i className={`fas ${icon}`}></i>
  </button>
);

const RichEditor: React.FC<RichEditorProps> = ({ onHtmlChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Type '/' for commands…" }),
      SlashCommands,
    ],
    onUpdate({ editor }) {
      onHtmlChange(editor.getHTML());
    },
    editorProps: {
      attributes: { class: 'rich-editor-content focus:outline-none' },
    },
  });

  const setLink = () => {
    if (!editor) return;
    const url = window.prompt('URL:', editor.getAttributes('link').href ?? '');
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="email-card">
      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex items-center bg-gray-800 rounded-lg shadow-lg px-1 py-0.5 gap-0.5">
            <BubbleButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon="fa-bold" title="Bold" />
            <BubbleButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon="fa-italic" title="Italic" />
            <BubbleButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} icon="fa-underline" title="Underline" />
            <BubbleButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} icon="fa-strikethrough" title="Strikethrough" />
            <BubbleButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} icon="fa-code" title="Inline code" />
            <div className="w-px h-4 bg-gray-600 mx-0.5" />
            <BubbleButton onClick={setLink} active={editor.isActive('link')} icon="fa-link" title="Link" />
          </div>
        </BubbleMenu>
      )}

      <div className="px-6 pt-5 pb-2">
        <p className="email-static">Hey {'{{contact.first_name | there }}'},</p>
        <EditorContent editor={editor} />
        <p className="email-static">
          Thank you,<br />
          Yordan from Data Gibberish
        </p>
      </div>

      <div className="email-footer">
        <div className="email-footer-links">
          <a href="https://www.datagibberish.com" className="email-footer-link">
            <i className="fas fa-envelope"></i> Newsletter
          </a>
          <a href="https://www.ivanovyordan.com/coaching" className="email-footer-link">
            <i className="fas fa-graduation-cap"></i> Coaching
          </a>
          <a href="https://linkedin.com/in/ivanovyordan" className="email-footer-link">
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
        </div>
        <p className="email-footer-text">Sent with ❤️ by Yordan Ivanov</p>
        <p className="email-footer-meta"><a href="#">Unsubscribe</a></p>
      </div>
    </div>
  );
};

export default RichEditor;
