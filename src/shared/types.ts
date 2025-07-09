export interface IpcHandlers {
  "get-template": () => Promise<string>;
  "save-template": (template: string) => Promise<boolean>;
  "copy-to-clipboard": (html: string) => Promise<boolean>;
  "open-settings": () => void;
}

export interface IpcEvents {
  "template-updated": (template: string) => void;
  "close-settings-window": () => void;
}

export interface AppState {
  markdown: string;
  html: string;
  template: string;
  viewMode: "preview" | "html";
  isSettingsOpen: boolean;
  isHelpOpen: boolean;
}

export interface KeyboardShortcut {
  key: string;
  action: () => void;
  description: string;
}

export interface TemplateData {
  content: string;
  isDefault: boolean;
}
