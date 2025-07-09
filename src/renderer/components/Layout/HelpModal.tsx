import React, { useEffect } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i className="fas fa-keyboard text-primary-600"></i>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Text Formatting */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Formatting</h3>
              <div className="space-y-3">
                <ShortcutItem key="bold" shortcut="Cmd/Ctrl + B" description="Bold" />
                <ShortcutItem key="italic" shortcut="Cmd/Ctrl + I" description="Italic" />
                <ShortcutItem key="link" shortcut="Cmd/Ctrl + K" description="Link" />
                <ShortcutItem key="code" shortcut="Cmd/Ctrl + `" description="Inline Code" />
                <ShortcutItem key="strikethrough" shortcut="Cmd/Ctrl + S" description="Strikethrough" />
                <ShortcutItem key="underline" shortcut="Cmd/Ctrl + U" description="Underline" />
              </div>
            </div>

            {/* Headings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Headings</h3>
              <div className="space-y-3">
                <ShortcutItem key="heading" shortcut="Cmd/Ctrl + 1-6" description="Heading 1-6" />
              </div>
            </div>

            {/* Lists & Structure */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lists & Structure</h3>
              <div className="space-y-3">
                <ShortcutItem key="bullet" shortcut="Cmd/Ctrl + L" description="Bullet List" />
                <ShortcutItem key="numbered" shortcut="Cmd/Ctrl + O" description="Numbered List" />
                <ShortcutItem key="quote" shortcut="Cmd/Ctrl + Q" description="Blockquote" />
                <ShortcutItem key="codeblock" shortcut="Cmd/Ctrl + C" description="Code Block" />
                <ShortcutItem key="hr" shortcut="Cmd/Ctrl + H" description="Horizontal Rule" />
                <ShortcutItem key="image" shortcut="Cmd/Ctrl + M" description="Image" />
                <ShortcutItem key="table" shortcut="Cmd/Ctrl + T" description="Table" />
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-3">
                <ShortcutItem key="tab" shortcut="Tab" description="Indent (4 spaces)" />
                <ShortcutItem key="enter" shortcut="Enter" description="Smart List Continuation" />
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Features</h3>
            <div className="space-y-3">
              <ShortcutItem
                key="paste-url"
                shortcut="Paste URL + Selection"
                description="Create Link from Selected Text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ShortcutItemProps {
  shortcut: string;
  description: string;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ shortcut, description }) => (
  <div className="flex items-center justify-between">
    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
      {shortcut}
    </span>
    <span className="text-gray-600">{description}</span>
  </div>
);

export default HelpModal;