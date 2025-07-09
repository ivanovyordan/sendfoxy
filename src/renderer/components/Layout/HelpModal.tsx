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
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + B</span>
                  <span className="text-gray-600">Bold</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + I</span>
                  <span className="text-gray-600">Italic</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + K</span>
                  <span className="text-gray-600">Link</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + `</span>
                  <span className="text-gray-600">Inline Code</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + S</span>
                  <span className="text-gray-600">Strikethrough</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + U</span>
                  <span className="text-gray-600">Underline</span>
                </div>
              </div>
            </div>

            {/* Headings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Headings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + 1-6</span>
                  <span className="text-gray-600">Heading 1-6</span>
                </div>
              </div>
            </div>

            {/* Lists & Structure */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lists & Structure</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + L</span>
                  <span className="text-gray-600">Bullet List</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + O</span>
                  <span className="text-gray-600">Numbered List</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + Q</span>
                  <span className="text-gray-600">Blockquote</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + C</span>
                  <span className="text-gray-600">Code Block</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + H</span>
                  <span className="text-gray-600">Horizontal Rule</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + M</span>
                  <span className="text-gray-600">Image</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Cmd/Ctrl + T</span>
                  <span className="text-gray-600">Table</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Tab</span>
                  <span className="text-gray-600">Indent (4 spaces)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Enter</span>
                  <span className="text-gray-600">Smart List Continuation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">Paste URL + Selection</span>
                <span className="text-gray-600">Create Link from Selected Text</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;