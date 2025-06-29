const { ipcRenderer } = require("electron");

// DOM elements
const templateInput = document.getElementById("templateInput");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const closeBtn = document.getElementById("closeBtn");

// Initialize
async function init() {
  try {
    const template = await ipcRenderer.invoke("get-template");
    templateInput.value = template;
    console.log("Settings initialized successfully");
  } catch (error) {
    console.error("Error initializing settings:", error);
  }
}

// Save template
async function saveTemplate() {
  try {
    const template = templateInput.value;
    const success = await ipcRenderer.invoke("save-template", template);

    if (success) {
      // Show success feedback
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
      saveBtn.style.background = "linear-gradient(135deg, #28a745, #20c997)";

      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = "";
      }, 2000);

      // Notify main window
      ipcRenderer.send("template-updated", template);
      console.log("Template saved successfully");
    } else {
      // Show error feedback
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
      saveBtn.style.background = "linear-gradient(135deg, #dc3545, #c82333)";

      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = "";
      }, 2000);
      console.error("Failed to save template");
    }
  } catch (error) {
    console.error("Error saving template:", error);
    // Show error feedback
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
    saveBtn.style.background = "linear-gradient(135deg, #dc3545, #c82333)";

    setTimeout(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.style.background = "";
    }, 2000);
  }
}

// Reset to default
async function resetTemplate() {
  try {
    const template = await ipcRenderer.invoke("get-template");
    templateInput.value = template;

    // Show feedback
    const originalText = resetBtn.innerHTML;
    resetBtn.innerHTML = '<i class="fas fa-check"></i> Reset!';
    resetBtn.style.background = "linear-gradient(135deg, #28a745, #20c997)";

    setTimeout(() => {
      resetBtn.innerHTML = originalText;
      resetBtn.style.background = "";
    }, 2000);
    console.log("Template reset successfully");
  } catch (error) {
    console.error("Error resetting template:", error);
  }
}

// Close window - improved for packaged apps
function closeWindow() {
  try {
    // Try multiple methods to close the window
    if (window.opener) {
      // If this is a modal window, try to close it properly
      window.close();
    } else {
      // Fallback: send a message to the main process to close this window
      ipcRenderer.send("close-settings-window");
    }
    console.log("Attempting to close settings window");
  } catch (error) {
    console.error("Error closing window:", error);
    // Final fallback
    window.close();
  }
}

// Event listeners
saveBtn.addEventListener("click", saveTemplate);
resetBtn.addEventListener("click", resetTemplate);
closeBtn.addEventListener("click", closeWindow);

// Add keyboard shortcuts
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWindow();
  }
});

// Initialize on load
document.addEventListener("DOMContentLoaded", init);
