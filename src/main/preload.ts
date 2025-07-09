import { contextBridge, ipcRenderer } from "electron";
import { IpcHandlers, IpcEvents } from "../shared/types";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // IPC handlers
  getTemplate: (): Promise<string> => ipcRenderer.invoke("get-template"),
  saveTemplate: (template: string): Promise<boolean> =>
    ipcRenderer.invoke("save-template", template),
  copyToClipboard: (html: string): Promise<boolean> =>
    ipcRenderer.invoke("copy-to-clipboard", html),
  openExternal: (url: string): Promise<void> =>
    ipcRenderer.invoke("open-external", url),

  // IPC events
  onTemplateUpdated: (callback: (template: string) => void) => {
    const handler = (event: any, template: string) => callback(template);
    ipcRenderer.on("template-updated", handler);
  },

  templateUpdated: (template: string): void => {
    ipcRenderer.send("template-updated", template);
  },
});

// Type for the exposed API
export interface ElectronAPI {
  getTemplate: () => Promise<string>;
  saveTemplate: (template: string) => Promise<boolean>;
  copyToClipboard: (html: string) => Promise<boolean>;
  openExternal: (url: string) => Promise<void>;
  onTemplateUpdated: (callback: (template: string) => void) => void;
  templateUpdated: (template: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
