import React from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { Emoji, emojis } from '@tiptap/extension-emoji';
import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import SlashCommandsList, { SlashCommand } from './SlashCommandsList';
import EmojiList, { EmojiItem } from './EmojiList';
import BubbleToolbar from './BubbleToolbar';

interface RichEditorProps {
  onHtmlChange: (html: string) => void;
}

const COMMANDS: SlashCommand[] = [
  { title: 'Text',          description: 'Plain paragraph',   icon: 'fa-paragraph',  command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run() },
  { title: 'Heading 1',    description: 'Large heading',      icon: 'fa-heading',    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run() },
  { title: 'Heading 2',    description: 'Medium heading',     icon: 'fa-heading',    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run() },
  { title: 'Heading 3',    description: 'Small heading',      icon: 'fa-heading',    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run() },
  { title: 'Bullet list',  description: 'Unordered list',     icon: 'fa-list-ul',    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: 'Numbered list',description: 'Ordered list',       icon: 'fa-list-ol',    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: 'Table',         description: '3×3 table',         icon: 'fa-table',      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { title: 'Blockquote',   description: 'Quote block',        icon: 'fa-quote-left', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
  { title: 'Code block',   description: 'Code snippet',       icon: 'fa-file-code',  command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
  { title: 'Divider',      description: 'Horizontal line',    icon: 'fa-minus',      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
  { title: 'Emoji',        description: "Search emoji by name", icon: 'fa-face-smile', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent(':').run() },
];

function makePopup<TRef extends { onKeyDown: (p: { event: KeyboardEvent }) => boolean }>(
  Component: React.ForwardRefExoticComponent<any>,
) {
  return () => {
    let renderer: ReactRenderer<TRef>;
    let container: HTMLDivElement;
    return {
      onStart(props: any) {
        container = document.createElement('div');
        container.style.cssText = 'position:fixed;z-index:9999;';
        document.body.appendChild(container);
        renderer = new ReactRenderer(Component, { props, editor: props.editor });
        container.appendChild(renderer.element);
        const rect = props.clientRect?.();
        if (rect) { container.style.top = `${rect.bottom + 4}px`; container.style.left = `${rect.left}px`; }
      },
      onUpdate(props: any) {
        renderer.updateProps(props);
        const rect = props.clientRect?.();
        if (rect) { container.style.top = `${rect.bottom + 4}px`; container.style.left = `${rect.left}px`; }
      },
      onKeyDown(props: any) {
        if (props.event.key === 'Escape') { container.remove(); renderer.destroy(); return true; }
        return renderer.ref?.onKeyDown(props) ?? false;
      },
      onExit() { container.remove(); renderer.destroy(); },
    };
  };
}

const SlashCommands = Extension.create({
  name: 'slashCommands',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: new PluginKey('slashCommands'),
        editor: this.editor,
        char: '/',
        items: ({ query }: { query: string }) =>
          COMMANDS.filter(c => c.title.toLowerCase().includes(query.toLowerCase())),
        render: makePopup(SlashCommandsList),
        command: ({ editor, range, props }) => (props as SlashCommand).command({ editor, range }),
      }),
    ];
  },
});

const EMOJI_LIST: EmojiItem[] = emojis
  .filter((e): e is typeof e & { emoji: string } => typeof e.emoji === 'string');

const EmojiSuggestion = Extension.create({
  name: 'emojiSuggestion',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: new PluginKey('emojiSuggestion'),
        editor: this.editor,
        char: ':',
        items: ({ query }: { query: string }) => {
          if (query.length < 1) return [];
          const q = query.toLowerCase();
          return EMOJI_LIST.filter(e =>
            e.shortcodes?.some(s => s.includes(q)) || e.name.includes(q)
          ).slice(0, 8);
        },
        render: makePopup(EmojiList),
        command: ({ editor, range, props }) => {
          const item = props as EmojiItem;
          editor.chain().focus().deleteRange(range).insertContent(item.emoji).run();
        },
      }),
    ];
  },
});

const RichEditor: React.FC<RichEditorProps> = ({ onHtmlChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Type '/' for commands, ':emoji:' for emoji…" }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Superscript,
      Subscript,
      Emoji.configure({ enableEmoticons: true }),
      SlashCommands,
      EmojiSuggestion,
    ],
    onUpdate({ editor }) {
      onHtmlChange(editor.getHTML());
    },
    editorProps: {
      attributes: { class: 'rich-editor-content focus:outline-none' },
    },
  });

  return (
    <div className="email-card">
      {editor && (
        <BubbleMenu editor={editor}>
          <BubbleToolbar editor={editor} />
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
          <a href="https://www.datagibberish.com" className="email-footer-link"><i className="fas fa-envelope"></i> Newsletter</a>
          <a href="https://www.ivanovyordan.com/coaching" className="email-footer-link"><i className="fas fa-graduation-cap"></i> Coaching</a>
          <a href="https://linkedin.com/in/ivanovyordan" className="email-footer-link"><i className="fab fa-linkedin"></i> LinkedIn</a>
        </div>
        <p className="email-footer-text">Sent with ❤️ by Yordan Ivanov</p>
        <p className="email-footer-meta"><a href="#">Unsubscribe</a></p>
      </div>
    </div>
  );
};

export default RichEditor;
