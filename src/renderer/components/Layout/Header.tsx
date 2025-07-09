import React from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
  onCopyClick: () => void;
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onCopyClick, onHelpClick }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i className="fas fa-envelope text-primary-600"></i>
            Sendfoxy
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={onHelpClick}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Keyboard Shortcuts"
            >
              <i className="fas fa-question text-lg"></i>
            </button>

            <button
              onClick={onSettingsClick}
              className="btn btn-secondary"
            >
              <i className="fas fa-cog mr-2"></i>
              Settings
            </button>

            <button
              onClick={onCopyClick}
              className="btn btn-primary"
            >
              <i className="fas fa-copy mr-2"></i>
              Copy HTML
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;