import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Editor } from '@tiptap/react';

export interface SlashCommand {
  title: string;
  description: string;
  icon: string;
  command: (args: { editor: Editor; range: Range }) => void;
}

interface Range {
  from: number;
  to: number;
}

interface Props {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
}

export interface SlashCommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const SlashCommandsList = forwardRef<SlashCommandsListRef, Props>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        setSelectedIndex(i => (i - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex(i => (i + 1) % items.length);
        return true;
      }
      if (event.key === 'Enter') {
        if (items[selectedIndex]) command(items[selectedIndex]);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) {
    return (
      <div className="slash-menu">
        <div className="slash-menu-empty">No results</div>
      </div>
    );
  }

  return (
    <div className="slash-menu">
      {items.map((item, index) => (
        <button
          key={item.title}
          className={`slash-menu-item ${index === selectedIndex ? 'slash-menu-item-active' : ''}`}
          onMouseDown={e => { e.preventDefault(); command(item); }}
        >
          <span className="slash-menu-icon">
            <i className={`fas ${item.icon}`}></i>
          </span>
          <span className="slash-menu-text">
            <span className="slash-menu-title">{item.title}</span>
            <span className="slash-menu-desc">{item.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
});

SlashCommandsList.displayName = 'SlashCommandsList';
export default SlashCommandsList;
