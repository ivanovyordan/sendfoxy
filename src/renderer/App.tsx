import React, { useCallback, useRef } from 'react';
import Header from './components/Layout/Header';
import RichEditor from './components/Editor/RichEditor';

// Body-only template with inline styles for email client compatibility.
// Paste this directly into Sendfox's HTML editor.
const TEMPLATE = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <p style="margin: 0 0 16px 0;">Hey {{contact.first_name | there }},</p>

    [CONTENT]

    <p style="margin: 16px 0 0 0;">Thank you,<br/>Yordan from Data Gibberish</p>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
      <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
        <a href="https://www.datagibberish.com" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 15px; background: #f8f9fa; border-radius: 6px; color: #495057; text-decoration: none; font-size: 14px;">
          <i class="fas fa-envelope"></i> Newsletter
        </a>
        <a href="https://www.ivanovyordan.com/coaching" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 15px; background: #f8f9fa; border-radius: 6px; color: #495057; text-decoration: none; font-size: 14px;">
          <i class="fas fa-graduation-cap"></i> Coaching
        </a>
        <a href="https://linkedin.com/in/ivanovyordan" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 15px; background: #f8f9fa; border-radius: 6px; color: #495057; text-decoration: none; font-size: 14px;">
          <i class="fab fa-linkedin"></i> LinkedIn
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

  const handleHtmlChange = useCallback((html: string) => {
    htmlRef.current = html;
  }, []);

  const handleCopyHtml = async () => {
    const output = TEMPLATE.replace('[CONTENT]', htmlRef.current);
    try {
      await navigator.clipboard.writeText(output);
    } catch (error) {
      console.error('Error copying HTML:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCopyClick={handleCopyHtml} />
      <main className="pt-20 pb-10 px-4">
        <RichEditor onHtmlChange={handleHtmlChange} />
      </main>
    </div>
  );
};

export default App;
