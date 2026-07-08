import React from 'react';

interface HeaderProps {
  onCopyClick: () => void;
  copied: boolean;
}

const Header: React.FC<HeaderProps> = ({ onCopyClick, copied }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i className="fas fa-envelope text-primary-600"></i>
            Sendfoxy
          </h1>
          <button onClick={onCopyClick} className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}>
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-2`}></i>
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
