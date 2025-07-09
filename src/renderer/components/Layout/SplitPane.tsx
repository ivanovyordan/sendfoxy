import React, { useRef } from 'react';
import MarkdownEditor, { MarkdownEditorHandle } from '../Editor/MarkdownEditor';
import Preview from '../Editor/Preview';

interface SplitPaneProps {
  markdown: string;
  html: string;
  viewMode: 'preview' | 'html';
  onMarkdownChange: (markdown: string) => void;
  onViewModeChange: (viewMode: 'preview' | 'html') => void;
}

const SplitPane: React.FC<SplitPaneProps> = ({
  markdown,
  html,
  viewMode,
  onMarkdownChange,
  onViewModeChange,
}) => {
  const editorRef = useRef<MarkdownEditorHandle>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Pane - Markdown Input */}
      <div className="pane flex flex-col">
        <div className="pane-header">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-edit text-primary-600"></i>
            Markdown
          </h2>
        </div>
        <div className="pane-content flex-1 overflow-hidden">
          <MarkdownEditor
            ref={editorRef}
            value={markdown}
            onChange={onMarkdownChange}
          />
        </div>
      </div>

      {/* Right Pane - Preview/HTML */}
      <div className="pane flex flex-col">
        <div className="pane-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-eye text-primary-600"></i>
            Preview
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('preview')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-eye mr-1"></i>
              Preview
            </button>
            <button
              onClick={() => onViewModeChange('html')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'html'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-code mr-1"></i>
              HTML
            </button>
          </div>
        </div>
        <div className="pane-content flex-1 overflow-hidden">
          <Preview
            html={html}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default SplitPane;