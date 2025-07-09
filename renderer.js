const { ipcRenderer, shell } = require("electron");
const { marked } = require("marked");
const juice = require("juice");
const TurndownService = require("turndown");
const KeyboardShortcuts = require("./keyboard-shortcuts");

// Initialize Turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  bulletListMarker: "-",
  hr: "---",
});

// Configure Turndown for better conversion
turndownService.addRule("underline", {
  filter: "u",
  replacement: function (content) {
    return `<u>${content}</u>`;
  },
});

turndownService.addRule("strikethrough", {
  filter: ["s", "strike", "del"],
  replacement: function (content) {
    return `~~${content}~~`;
  },
});

// Make turndownService available globally for the KeyboardShortcuts class
window.turndownService = turndownService;

// DOM elements
const markdownInput = document.getElementById("markdownInput");
const previewContent = document.getElementById("previewContent");
const htmlContent = document.getElementById("htmlContent");
const previewBtn = document.getElementById("previewBtn");
const htmlBtn = document.getElementById("htmlBtn");
const copyBtn = document.getElementById("copyBtn");
const settingsBtn = document.getElementById("settingsBtn");
const helpIcon = document.getElementById("helpIcon");
const helpModal = document.getElementById("helpModal");
const closeHelpModal = document.getElementById("closeHelpModal");

let currentTemplate = "";
let currentHtml = "";
let keyboardShortcuts;

// Scroll sync between editor and preview
function setupScrollSync() {
  let isSyncingEditor = false;
  let isSyncingPreview = false;

  function getScrollRatio(element) {
    return element.scrollTop / (element.scrollHeight - element.clientHeight);
  }

  function setScrollRatio(element, ratio) {
    element.scrollTop = ratio * (element.scrollHeight - element.clientHeight);
  }

  markdownInput.addEventListener("scroll", () => {
    if (isSyncingEditor) return;
    if (previewContent.style.display === "none") return;
    isSyncingPreview = true;
    setScrollRatio(previewContent, getScrollRatio(markdownInput));
    isSyncingPreview = false;
  });

  previewContent.addEventListener("scroll", () => {
    if (isSyncingPreview) return;
    if (previewContent.style.display === "none") return;
    isSyncingEditor = true;
    setScrollRatio(markdownInput, getScrollRatio(previewContent));
    isSyncingEditor = false;
  });
}

// Initialize
async function init() {
  currentTemplate = await ipcRenderer.invoke("get-template");
  updatePreview();

  // Initialize keyboard shortcuts
  keyboardShortcuts = new KeyboardShortcuts(markdownInput);

  setupHelpModal();
  setupScrollSync();
}

// Setup help modal functionality
function setupHelpModal() {
  helpIcon.addEventListener("click", showHelpModal);
  closeHelpModal.addEventListener("click", hideHelpModal);

  // Close modal when clicking outside
  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      hideHelpModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && helpModal.classList.contains("show")) {
      hideHelpModal();
    }
  });
}

// Show help modal
function showHelpModal() {
  helpModal.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Hide help modal
function hideHelpModal() {
  helpModal.classList.remove("show");
  document.body.style.overflow = ""; // Restore scrolling
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
