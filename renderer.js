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
const helpIcon = document.getElementById("helpIcon");
const helpModal = document.getElementById("helpModal");
const closeHelpModal = document.getElementById("closeHelpModal");

let currentTemplate = "";
let currentHtml = "";

// Initialize
async function init() {
  currentTemplate = await ipcRenderer.invoke("get-template");
  updatePreview();
  setupKeyboardShortcuts();
  setupHelpModal();
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
  markdownInput.addEventListener("keydown", handleKeyboardShortcuts);
  markdownInput.addEventListener("paste", handlePaste);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

  if (cmdOrCtrl && !event.shiftKey && !event.altKey) {
    switch (event.key.toLowerCase()) {
      case "b":
        event.preventDefault();
        wrapSelection("**", "**");
        break;
      case "i":
        event.preventDefault();
        wrapSelection("*", "*");
        break;
      case "k":
        event.preventDefault();
        wrapSelection("[", "](url)");
        break;
      case "`":
        event.preventDefault();
        wrapSelection("`", "`");
        break;
      case "s":
        event.preventDefault();
        wrapSelection("~~", "~~");
        break;
      case "q":
        event.preventDefault();
        insertAtLineStart("> ");
        break;
      case "1":
        event.preventDefault();
        insertAtLineStart("# ");
        break;
      case "2":
        event.preventDefault();
        insertAtLineStart("## ");
        break;
      case "3":
        event.preventDefault();
        insertAtLineStart("### ");
        break;
      case "4":
        event.preventDefault();
        insertAtLineStart("#### ");
        break;
      case "5":
        event.preventDefault();
        insertAtLineStart("##### ");
        break;
      case "6":
        event.preventDefault();
        insertAtLineStart("###### ");
        break;
      case "l":
        event.preventDefault();
        insertAtLineStart("- ");
        break;
      case "o":
        event.preventDefault();
        insertAtLineStart("1. ");
        break;
      case "c":
        event.preventDefault();
        insertCodeBlock();
        break;
      case "h":
        event.preventDefault();
        insertHorizontalRule();
        break;
      case "u":
        event.preventDefault();
        wrapSelection("<u>", "</u>");
        break;
      case "m":
        event.preventDefault();
        insertImage();
        break;
      case "t":
        event.preventDefault();
        insertTable();
        break;
    }
  }

  // Handle Shift + shortcuts
  if (event.shiftKey && !cmdOrCtrl && !event.altKey) {
    switch (event.key) {
      case "Tab":
        event.preventDefault();
        insertAtCursor("    "); // 4 spaces for indentation
        break;
    }
  }

  // Handle Tab key
  if (event.key === "Tab" && !event.shiftKey && !cmdOrCtrl && !event.altKey) {
    event.preventDefault();
    insertAtCursor("    "); // 4 spaces for indentation
  }

  // Handle Enter key for smart list continuation
  if (event.key === "Enter" && !cmdOrCtrl && !event.altKey) {
    handleEnterKey(event);
  }
}

// Insert text at the current cursor position
function insertAtCursor(text) {
  document.execCommand("insertText", false, text);
}

// Insert text at the beginning of the current line
function insertAtLineStart(text) {
  const cursorPos = markdownInput.selectionStart;
  const currentValue = markdownInput.value;

  // Find the start of the current line
  let lineStart = cursorPos;
  while (lineStart > 0 && currentValue[lineStart - 1] !== "\n") {
    lineStart--;
  }

  // Move cursor to line start and insert text
  markdownInput.setSelectionRange(lineStart, lineStart);
  document.execCommand("insertText", false, text);
}

// Insert a code block
function insertCodeBlock() {
  const codeBlock = "\n```\n\n```\n";
  document.execCommand("insertText", false, codeBlock);

  // Place cursor inside the code block
  const cursorPos = markdownInput.selectionStart;
  const newCursorPos = cursorPos - 4; // Move back 4 characters to be inside the code block
  markdownInput.setSelectionRange(newCursorPos, newCursorPos);
}

// Insert horizontal rule
function insertHorizontalRule() {
  const hr = "\n---\n";
  document.execCommand("insertText", false, hr);
}

// Insert image
function insertImage() {
  const selectedText = getSelectedText();
  if (selectedText) {
    const imageMarkdown = `![${selectedText}](image-url)`;
    document.execCommand("insertText", false, imageMarkdown);
  } else {
    const imageMarkdown = "![alt text](image-url)";
    document.execCommand("insertText", false, imageMarkdown);
  }
}

// Insert table
function insertTable() {
  const table =
    "\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n";
  document.execCommand("insertText", false, table);
}

// Handle Enter key for smart list continuation
function handleEnterKey(event) {
  const cursorPos = markdownInput.selectionStart;
  const currentValue = markdownInput.value;

  // Find the current line
  let lineStart = cursorPos;
  while (lineStart > 0 && currentValue[lineStart - 1] !== "\n") {
    lineStart--;
  }

  const currentLine = currentValue.substring(lineStart, cursorPos);

  // Check for list patterns
  const bulletMatch = currentLine.match(/^(\s*)([-*+])\s/);
  const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
  const quoteMatch = currentLine.match(/^(\s*)(>)\s/);

  if (bulletMatch) {
    event.preventDefault();
    const indent = bulletMatch[1];
    const bullet = bulletMatch[2];
    const continuation = `\n${indent}${bullet} `;
    document.execCommand("insertText", false, continuation);
  } else if (numberMatch) {
    event.preventDefault();
    const indent = numberMatch[1];
    const number = parseInt(numberMatch[2]) + 1;
    const continuation = `\n${indent}${number}. `;
    document.execCommand("insertText", false, continuation);
  } else if (quoteMatch) {
    event.preventDefault();
    const indent = quoteMatch[1];
    const continuation = `\n${indent}> `;
    document.execCommand("insertText", false, continuation);
  }
}

// Handle paste events for link functionality
function handlePaste(event) {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData("text");

  // Check if pasted text looks like a URL
  if (isUrl(pastedText) && hasSelection()) {
    event.preventDefault();
    const selectedText = getSelectedText();
    const linkMarkdown = `[${selectedText}](${pastedText})`;
    replaceSelection(linkMarkdown);
  }
}

// Check if text looks like a URL
function isUrl(text) {
  const urlPattern = /^(https?:\/\/|www\.)/i;
  return urlPattern.test(text.trim());
}

// Check if there's a text selection
function hasSelection() {
  return markdownInput.selectionStart !== markdownInput.selectionEnd;
}

// Get selected text
function getSelectedText() {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  return markdownInput.value.substring(start, end);
}

// Replace selected text
function replaceSelection(newText) {
  document.execCommand("insertText", false, newText);
}

// Wrap selected text with prefix and suffix
function wrapSelection(prefix, suffix) {
  const selectedText = getSelectedText();
  if (selectedText) {
    // Use execCommand to maintain undo history
    document.execCommand("insertText", false, prefix + selectedText + suffix);
  } else {
    // If no selection, insert the wrapping and place cursor in the middle
    const cursorPos = markdownInput.selectionStart;
    const currentValue = markdownInput.value;
    const newValue =
      currentValue.substring(0, cursorPos) +
      prefix +
      suffix +
      currentValue.substring(cursorPos);

    // Use execCommand to maintain undo history
    document.execCommand("insertText", false, prefix + suffix);

    // Place cursor between prefix and suffix
    const newCursorPos = cursorPos + prefix.length;
    markdownInput.setSelectionRange(newCursorPos, newCursorPos);
  }
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
