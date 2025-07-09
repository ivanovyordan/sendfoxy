import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import juice from 'juice';
import { AppState } from '@/shared/types';
import Header from './components/Layout/Header';
import SplitPane from './components/Layout/SplitPane';
import HelpModal from './components/Layout/HelpModal';
import SettingsModal from './components/Settings/SettingsModal';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    markdown: `# Welcome to Sendfoxy

This is a **bold** text and this is *italic*.

## Features

- Convert markdown to HTML emails
- Inline CSS for Gmail compatibility
- Custom templates
- Easy copy to clipboard

### Links

Visit [our website](https://example.com) for more information.

### Code Example

\`\`\`javascript
console.log('Hello, Sendfoxy!');
\`\`\`

---

*Built with ❤️ by [Yordan Ivanov](https://ivanovyordan.com)*`,
    html: '',
    template: '',
    viewMode: 'preview',
    isSettingsOpen: false,
    isHelpOpen: false,
  });

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        const template = await window.electronAPI.getTemplate();
        setAppState(prev => ({ ...prev, template }));
        updatePreview(appState.markdown, template);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initApp();

    window.electronAPI.onTemplateUpdated((template) => {
      setAppState(prev => ({ ...prev, template }));
      updatePreview(appState.markdown, template);
    });

    if (window.location.hash === '#settings') {
      setAppState(prev => ({ ...prev, isSettingsOpen: true }));
    }
  }, []);

  const updatePreview = (markdown: string, template: string) => {
    const htmlFromMarkdown = marked(markdown);
    const fullHtml = template.replace('[CONTENT]', htmlFromMarkdown);
    const inlinedHtml = juice(fullHtml);

    setAppState(prev => ({ ...prev, html: inlinedHtml }));
  };

  const handleMarkdownChange = (markdown: string) => {
    setAppState(prev => ({ ...prev, markdown }));
    updatePreview(markdown, appState.template);
  };

  const handleViewModeChange = (viewMode: 'preview' | 'html') => {
    setAppState(prev => ({ ...prev, viewMode }));
  };

  const handleCopyHtml = async () => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = appState.html;

      const emailWrapper = tempDiv.querySelector('.email-wrapper');
      let htmlToCopy = '';

      if (emailWrapper) {
        htmlToCopy = emailWrapper.outerHTML;
      } else {
        const bodyElement = tempDiv.querySelector('body');
        if (bodyElement) {
          htmlToCopy = bodyElement.outerHTML;
        } else {
          htmlToCopy = appState.html;
        }
      }

      if (htmlToCopy && htmlToCopy.trim() !== '') {
        await window.electronAPI.copyToClipboard(htmlToCopy);
      }
    } catch (error) {
      console.error('Error copying HTML:', error);
    }
  };

  const handleOpenSettings = () => {
    setAppState(prev => ({ ...prev, isSettingsOpen: true }));
  };

  const handleCloseSettings = () => {
    setAppState(prev => ({ ...prev, isSettingsOpen: false }));
    if (window.location.hash === '#settings') {
      window.location.hash = '';
    }
  };

  const handleOpenHelp = () => {
    setAppState(prev => ({ ...prev, isHelpOpen: true }));
  };

  const handleCloseHelp = () => {
    setAppState(prev => ({ ...prev, isHelpOpen: false }));
  };

  // If we're in settings mode, show settings modal
  if (window.location.hash === '#settings') {
    return (
      <SettingsModal
        isOpen={true}
        onClose={handleCloseSettings}
        template={appState.template}
        onTemplateChange={(template) => {
          setAppState(prev => ({ ...prev, template }));
          updatePreview(appState.markdown, template);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSettingsClick={handleOpenSettings}
        onCopyClick={handleCopyHtml}
        onHelpClick={handleOpenHelp}
      />

      <main className="container mx-auto px-4 py-10 pt-24">
        <SplitPane
          markdown={appState.markdown}
          html={appState.html}
          viewMode={appState.viewMode}
          onMarkdownChange={handleMarkdownChange}
          onViewModeChange={handleViewModeChange}
        />
      </main>

      <SettingsModal
        isOpen={appState.isSettingsOpen}
        onClose={handleCloseSettings}
        template={appState.template}
        onTemplateChange={(template) => {
          setAppState(prev => ({ ...prev, template }));
          updatePreview(appState.markdown, template);
        }}
      />

      <HelpModal
        isOpen={appState.isHelpOpen}
        onClose={handleCloseHelp}
      />
    </div>
  );
};

export default App;