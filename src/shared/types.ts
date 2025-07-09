export interface IpcHandlers {
  "get-template": () => Promise<string>;
  "save-template": (template: string) => Promise<boolean>;
  "copy-to-clipboard": (html: string) => Promise<boolean>;
  "open-external": (url: string) => Promise<void>;
}

export interface IpcEvents {
  "template-updated": (template: string) => void;
}

export interface AppState {
  markdown: string;
  html: string;
  template: string;
  viewMode: "preview" | "html";
  isSettingsOpen: boolean;
  isHelpOpen: boolean;
}
