import { app, BrowserWindow, ipcMain, clipboard, shell } from "electron";
import { join } from "path";
import Store from "electron-store";
import { IpcHandlers, IpcEvents } from "../shared/types";

// Initialize store for settings with proper configuration for packaged apps
let store: Store;
try {
  store = new Store({
    name: "sendfoxy-settings",
    fileExtension: "json",
    clearInvalidConfig: true,
    encryptionKey: "sendfoxy-secure-key",
  });
  console.log("Store initialized successfully");
} catch (error) {
  console.error("Error initializing store:", error);
  // Fallback to default store
  store = new Store();
}

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
    icon: join(__dirname, "../../icon.png"),
    title: "Sendfoxy",
    show: false,
  });

  // Load the app
  if (app.isPackaged) {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  // Show window when ready to prevent visual glitches
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log("App is ready");
  console.log("App data path:", app.getPath("userData"));
  console.log("Store path:", store.path);
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// IPC Handlers
ipcMain.handle("get-template", async (): Promise<string> => {
  try {
    const template = store.get("template", getDefaultTemplate()) as string;
    console.log(
      "Template retrieved successfully:",
      template ? "exists" : "using default"
    );
    return template;
  } catch (error) {
    console.error("Error getting template:", error);
    return getDefaultTemplate();
  }
});

ipcMain.handle(
  "save-template",
  async (event, template: string): Promise<boolean> => {
    try {
      store.set("template", template);
      console.log("Template saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving template:", error);
      return false;
    }
  }
);

ipcMain.handle("copy-to-clipboard", (event, html: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      clipboard.writeText(html);
      resolve(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      resolve(false);
    }
  });
});

ipcMain.handle("open-external", async (event, url: string): Promise<void> => {
  await shell.openExternal(url);
});

// Handle template updates from settings window
ipcMain.on("template-updated", (event, template: string) => {
  // Forward the template update to the main window
  if (mainWindow) {
    mainWindow.webContents.send("template-updated", template);
  }
});

function getDefaultTemplate(): string {
  return `<!DOCTYPE html>
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
}
