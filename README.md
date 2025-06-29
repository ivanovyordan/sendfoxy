# Sendfoxy

A desktop application that converts markdown text into HTML emails compatible with Sendfox. Built with Electron, featuring real-time preview, custom templates, and CSS inlining for Gmail compatibility.

## Features

- **Split-pane Interface**: Left pane for markdown input, right pane for preview/HTML view
- **Real-time Preview**: See your email as you type
- **Custom Templates**: Configure HTML templates with CSS styling
- **CSS Inlining**: Automatically inlines CSS for Gmail compatibility using Juice
- **Copy to Clipboard**: One-click HTML copying for Sendfox
- **FontAwesome Icons**: Beautiful, consistent iconography throughout the app
- **Responsive Design**: Works on desktop and mobile devices

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sendfoxy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

## Development

To run the app in development mode with DevTools:

```bash
npm run dev
```

## Building

To build the application for distribution:

```bash
npm run build
```

## Usage

### Main Screen

1. **Markdown Input**: Type your email content in markdown format in the left pane
2. **Preview**: See the rendered email in the right pane
3. **HTML View**: Switch to HTML view to see the generated code
4. **Copy HTML**: Click the "Copy HTML" button to copy the email HTML to clipboard
5. **Settings**: Click the settings button to configure your email template

### Settings Screen

1. **Template Configuration**: Edit your HTML email template
2. **Placeholder**: Use `[CONTENT]` as a placeholder for your markdown content
3. **CSS Styling**: Include CSS in the `<style>` tag - it will be automatically inlined
4. **Save**: Click "Save Template" to apply changes
5. **Reset**: Click "Reset to Default" to restore the default template

### Template Guidelines

- Use `[CONTENT]` as a placeholder for markdown content
- Include CSS in the `<style>` tag
- CSS will be automatically inlined for Gmail compatibility
- Keep templates responsive for mobile devices
- Test your templates in various email clients

## Dependencies

- **Electron**: Desktop application framework
- **Marked**: Markdown to HTML conversion
- **Juice**: CSS inlining for email compatibility
- **Electron Store**: Persistent settings storage
- **FontAwesome**: Icon library

## Project Structure

```
sendfoxy/
├── main.js              # Main Electron process
├── renderer.js          # Main window renderer process
├── settings.js          # Settings window renderer process
├── index.html           # Main window HTML
├── settings.html        # Settings window HTML
├── styles/
│   ├── main.css         # Main window styles
│   └── settings.css     # Settings window styles
├── package.json         # Project configuration
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please use the GitHub issue tracker.
