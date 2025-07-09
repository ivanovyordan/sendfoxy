# Sendfoxy

A modern Electron application that converts markdown text into HTML emails for Sendfox, built with React, TypeScript, and Tailwind CSS.

## Features

- **Markdown to HTML Conversion**: Convert markdown content to HTML emails
- **Inline CSS**: Automatically inline CSS for Gmail compatibility using Juice
- **Custom Templates**: Fully customizable HTML email templates
- **Rich Text Editing**: Comprehensive keyboard shortcuts for markdown editing
- **Live Preview**: Real-time preview of your email content
- **HTML View**: Toggle between preview and raw HTML view
- **Settings Management**: Easy template configuration and management
- **Cross-platform**: Works on Windows, macOS, and Linux

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build Tool**: Vite
- **Desktop**: Electron 28
- **Markdown Processing**: Marked.js
- **CSS Inlining**: Juice
- **HTML to Markdown**: Turndown.js
- **State Management**: React hooks
- **Styling**: Tailwind CSS with custom components

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sendfoxy

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server (both renderer and main process)
npm run dev

# Build for production
npm run build

# Create distributable
npm run dist

# Start production build
npm start
```

### Project Structure

```
sendfoxy/
├── src/
│   ├── main/           # Main process (TypeScript)
│   │   ├── main.ts     # Main Electron process
│   │   └── preload.ts  # Preload script for IPC
│   ├── renderer/       # Renderer process (React)
│   │   ├── components/
│   │   │   ├── Layout/     # Header, SplitPane, HelpModal
│   │   │   ├── Editor/     # MarkdownEditor, Preview
│   │   │   ├── Settings/   # SettingsModal
│   │   │   └── UI/         # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── types/      # TypeScript type definitions
│   │   ├── utils/      # Utility functions
│   │   ├── App.tsx     # Main React component
│   │   ├── main.tsx    # React entry point
│   │   └── index.css   # Tailwind CSS imports
│   └── shared/         # Shared types and utilities
├── electron/           # Electron-specific config
├── dist/              # Build output
├── public/            # Static assets
└── templates/         # Email templates
```

## Keyboard Shortcuts

### Text Formatting

- `Cmd/Ctrl + B` - Bold
- `Cmd/Ctrl + I` - Italic
- `Cmd/Ctrl + K` - Link
- `Cmd/Ctrl + `` - Inline Code
- `Cmd/Ctrl + S` - Strikethrough
- `Cmd/Ctrl + U` - Underline

### Headings

- `Cmd/Ctrl + 1-6` - Heading 1-6

### Lists & Structure

- `Cmd/Ctrl + L` - Bullet List
- `Cmd/Ctrl + O` - Numbered List
- `Cmd/Ctrl + Q` - Blockquote
- `Cmd/Ctrl + C` - Code Block
- `Cmd/Ctrl + H` - Horizontal Rule
- `Cmd/Ctrl + M` - Image
- `Cmd/Ctrl + T` - Table

### Navigation

- `Tab` - Indent (4 spaces)
- `Enter` - Smart List Continuation

### Special Features

- Paste URL + Selection - Create Link from Selected Text

## Template System

The application uses a customizable HTML template system. Templates should include a `[CONTENT]` placeholder where the markdown content will be inserted.

### Default Template Features

- Responsive design
- FontAwesome icons
- Professional styling
- Footer with social links
- Mobile-friendly layout

### Customizing Templates

1. Open Settings (gear icon)
2. Edit the HTML template
3. Use `[CONTENT]` as a placeholder for markdown content
4. Save your changes

## Building for Distribution

```bash
# Build the application
npm run build

# Create distributable packages
npm run dist
```

The built application will be available in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Migration Notes

This application was migrated from vanilla JavaScript to React + TypeScript + Tailwind CSS. The migration included:

- **TypeScript**: Added type safety throughout the application
- **React**: Converted to component-based architecture
- **Tailwind CSS**: Modern utility-first styling
- **Vite**: Fast build tool for development and production
- **Improved IPC**: Secure preload script with proper type definitions
- **Better Development Experience**: Hot reload, better tooling, and debugging

All original functionality has been preserved while improving maintainability and developer experience.
