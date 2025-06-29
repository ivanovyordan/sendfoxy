const { ipcRenderer, shell } = require("electron");
const { marked } = require("marked");
const juice = require("juice");

// DOM elements
const markdownInput = document.getElementById("markdownInput");
const previewContent = document.getElementById("previewContent");
const htmlContent = document.getElementById("htmlContent");
const previewBtn = document.getElementById("previewBtn");
const htmlBtn = document.getElementById("htmlBtn");
const copyBtn = document.getElementById("copyBtn");
const settingsBtn = document.getElementById("settingsBtn");

let currentTemplate = "";
let currentHtml = "";

// Initialize
async function init() {
  currentTemplate = await ipcRenderer.invoke("get-template");
  updatePreview();
}

// Update preview
async function updatePreview() {
  const markdown = markdownInput.value;
  const htmlFromMarkdown = marked(markdown);

  // Replace [CONTENT] placeholder with markdown HTML
  const fullHtml = currentTemplate.replace("[CONTENT]", htmlFromMarkdown);

  // Inline CSS using juice
  currentHtml = juice(fullHtml);

  // Create a temporary div to extract the body content for preview
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = currentHtml;
  const bodyContent = tempDiv.querySelector("body");
  const previewHtml = bodyContent ? bodyContent.innerHTML : currentHtml;

  // Update preview with the full processed HTML
  previewContent.innerHTML = previewHtml;

  // Add click event listeners to all links in the preview
  addLinkHandlers();

  // Update HTML view
  htmlContent.textContent = currentHtml;
}

// Add click handlers to all links in the preview
function addLinkHandlers() {
  const links = previewContent.querySelectorAll("a[href]");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.href;
      shell.openExternal(url);
    });
  });
}

// Copy HTML to clipboard
async function copyHtml() {
  // Extract email-wrapper content from the full HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = currentHtml;

  // Find the email-wrapper element
  const emailWrapper = tempDiv.querySelector(".email-wrapper");
  let htmlToCopy;

  if (emailWrapper) {
    // Get the entire email-wrapper element (including the wrapper div and its attributes)
    htmlToCopy = emailWrapper.outerHTML;
  } else {
    // Fallback: if no email-wrapper found, try to find body element
    const bodyElement = tempDiv.querySelector("body");
    if (bodyElement) {
      htmlToCopy = bodyElement.outerHTML;
    } else {
      // Final fallback: use the full HTML
      htmlToCopy = currentHtml;
    }
  }

  // Ensure we have content to copy
  if (!htmlToCopy || htmlToCopy.trim() === "") {
    return;
  }

  await ipcRenderer.invoke("copy-to-clipboard", htmlToCopy);

  // Show feedback
  const originalText = copyBtn.innerHTML;
  copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
  copyBtn.style.background = "linear-gradient(135deg, #28a745, #20c997)";

  setTimeout(() => {
    copyBtn.innerHTML = originalText;
    copyBtn.style.background = "";
  }, 2000);
}

// Toggle view
function toggleView(view) {
  if (view === "preview") {
    previewBtn.classList.add("active");
    htmlBtn.classList.remove("active");
    previewContent.style.display = "block";
    htmlContent.style.display = "none";
  } else {
    htmlBtn.classList.add("active");
    previewBtn.classList.remove("active");
    previewContent.style.display = "none";
    htmlContent.style.display = "block";
  }
}

// Event listeners
markdownInput.addEventListener("input", updatePreview);

previewBtn.addEventListener("click", () => toggleView("preview"));
htmlBtn.addEventListener("click", () => toggleView("html"));
copyBtn.addEventListener("click", copyHtml);
settingsBtn.addEventListener("click", () => {
  ipcRenderer.invoke("open-settings");
});

// Listen for template updates from settings
ipcRenderer.on("template-updated", async (event, template) => {
  console.log(
    "Template updated from settings:",
    template ? "received" : "empty"
  );
  currentTemplate = template;
  updatePreview();
});

// Initialize on load
document.addEventListener("DOMContentLoaded", init);
