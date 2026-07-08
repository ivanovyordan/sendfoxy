import React, { useCallback, useRef, useState } from 'react';
import Header from './components/Layout/Header';
import RichEditor from './components/Editor/RichEditor';

// Body-only template with inline styles for email client compatibility.
// Paste this directly into Sendfox's HTML editor.
const TEMPLATE = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; padding: 30px;">
    [CONTENT]

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
      <div style="margin-bottom: 16px;">
        <a href="https://www.datagibberish.com" style="display: inline-block; margin: 4px 8px; padding: 10px 15px; background: #f8f9fa; color: #495057; text-decoration: none; font-size: 14px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Newsletter
        </a>
        <a href="https://www.ivanovyordan.com/coaching" style="display: inline-block; margin: 4px 8px; padding: 10px 15px; background: #f8f9fa; color: #495057; text-decoration: none; font-size: 14px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> Coaching
        </a>
        <a href="https://linkedin.com/in/ivanovyordan" style="display: inline-block; margin: 4px 8px; padding: 10px 15px; background: #f8f9fa; color: #495057; text-decoration: none; font-size: 14px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
        </a>
      </div>
      <p style="color: #6c757d; font-size: 14px; font-style: italic; margin: 0 0 12px 0;">Sent with ❤️ by Yordan Ivanov</p>
      <p style="margin: 0; font-size: 14px; color: #6c757d;">
        <a href="{{unsubscribe_url}}" style="color: #6c757d; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</div>`;

const App: React.FC = () => {
  const htmlRef = useRef<string>('');
  const [copied, setCopied] = useState(false);

  const handleHtmlChange = useCallback((html: string) => {
    htmlRef.current = html;
  }, []);

  const handleCopyHtml = async () => {
    const output = TEMPLATE.replace('[CONTENT]', htmlRef.current);
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying HTML:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCopyClick={handleCopyHtml} copied={copied} />
      <main className="pt-20 pb-10 px-4">
        <RichEditor onHtmlChange={handleHtmlChange} />
      </main>
    </div>
  );
};

export default App;
