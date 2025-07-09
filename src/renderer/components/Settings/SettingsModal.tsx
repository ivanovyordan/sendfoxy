import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  onTemplateChange: (template: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  template,
  onTemplateChange,
}) => {
  const [localTemplate, setLocalTemplate] = useState(template);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalTemplate(template);
  }, [template]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await window.electronAPI.saveTemplate(localTemplate);
      if (success) {
        onTemplateChange(localTemplate);
        window.electronAPI.templateUpdated(localTemplate);
        onClose();
      } else {
        alert('Failed to save template. Please try again.');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to the default template? This action cannot be undone.')) {
      const defaultTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <!-- FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .email-wrapper {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Footer Styles */
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
        }
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 15px;
        }
        .footer-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            background: #f8f9fa;
            border-radius: 6px;
            color: #495057;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        .footer-link:hover {
            background: #e9ecef;
            transform: translateY(-1px);
        }
        .footer-link i {
            font-size: 16px;
        }
        .footer-text {
            color: #6c757d;
            font-size: 14px;
        }

        /* Responsive footer */
        @media (max-width: 480px) {
            .footer-links {
                flex-direction: column;
                gap: 10px;
            }
            .footer-link {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            [CONTENT]

            <!-- Footer with FontAwesome Icons -->
            <div class="footer">
                <div class="footer-links">
                    <a href="https://yournewsletter.com" class="footer-link">
                        <i class="fas fa-envelope"></i>
                        Newsletter
                    </a>
                    <a href="https://yourcourse.com" class="footer-link">
                        <i class="fas fa-graduation-cap"></i>
                        Course
                    </a>
                    <a href="https://linkedin.com/in/yourprofile" class="footer-link">
                        <i class="fab fa-linkedin"></i>
                        LinkedIn
                    </a>
                </div>
                <div class="footer-text">
                    © 2024 Your Company. All rights reserved.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
      setLocalTemplate(defaultTemplate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i className="fas fa-cog text-primary-600"></i>
            Email Template Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                HTML Template
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="btn btn-secondary text-sm"
                >
                  <i className="fas fa-undo mr-2"></i>
                  Reset to Default
                </button>
              </div>
            </div>
            <textarea
              value={localTemplate}
              onChange={(e) => setLocalTemplate(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your HTML template here... Use [CONTENT] as a placeholder for the markdown content."
            />
            <p className="mt-2 text-sm text-gray-600">
              Use <code className="bg-gray-100 px-1 rounded">[CONTENT]</code> as a placeholder for the markdown content.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Template
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;