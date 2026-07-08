import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface EmojiItem {
  name: string;
  emoji: string;
  shortcodes?: string[];
  tags?: string[];
}

interface Props {
  items: EmojiItem[];
  command: (item: EmojiItem) => void;
}

export interface EmojiListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const EmojiList = forwardRef<EmojiListRef, Props>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') { setSelectedIndex(i => (i - 1 + items.length) % items.length); return true; }
      if (event.key === 'ArrowDown') { setSelectedIndex(i => (i + 1) % items.length); return true; }
      if (event.key === 'Enter') { if (items[selectedIndex]) command(items[selectedIndex]); return true; }
      return false;
    },
  }));

  if (items.length === 0) return null;

  return (
    <div className="slash-menu max-w-xs">
      {items.slice(0, 8).map((item, index) => (
        <button
          key={item.name}
          className={`slash-menu-item ${index === selectedIndex ? 'slash-menu-item-active' : ''}`}
          onMouseDown={e => { e.preventDefault(); command(item); }}
        >
          <span className="text-xl w-8 text-center shrink-0 leading-none">{item.emoji}</span>
          <span className="slash-menu-title">:{item.shortcodes?.[0] ?? item.name}:</span>
        </button>
      ))}
    </div>
  );
});

EmojiList.displayName = 'EmojiList';
export default EmojiList;
