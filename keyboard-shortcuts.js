// Keyboard shortcuts configuration and handlers
class KeyboardShortcuts {
  constructor(textarea) {
    this.textarea = textarea;
    this.isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.textarea.addEventListener("keydown", this.handleKeydown.bind(this));
    this.textarea.addEventListener("paste", this.handlePaste.bind(this));
  }

  handleKeydown(event) {
    const cmdOrCtrl = this.isMac ? event.metaKey : event.ctrlKey;

    // Handle Cmd/Ctrl + key combinations
    if (cmdOrCtrl && !event.shiftKey && !event.altKey) {
      const key = event.key.toLowerCase();
      const shortcut = this.shortcuts[key];

      if (shortcut) {
        event.preventDefault();
        shortcut.call(this);
        return;
      }
    }

    // Handle Tab key
    if (event.key === "Tab" && !event.shiftKey && !cmdOrCtrl && !event.altKey) {
      event.preventDefault();
      this.insertAtCursor("    ");
      return;
    }

    // Handle Shift + Tab
    if (event.shiftKey && event.key === "Tab" && !cmdOrCtrl && !event.altKey) {
      event.preventDefault();
      this.insertAtCursor("    ");
      return;
    }

    // Handle Enter for smart list continuation
    if (event.key === "Enter" && !cmdOrCtrl && !event.altKey) {
      this.handleEnterKey(event);
    }
  }

  handlePaste(event) {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text");
    const pastedHtml = clipboardData.getData("text/html");

    // Check if pasted text looks like a URL and we have text selected
    if (this.isUrl(pastedText) && this.hasSelection()) {
      event.preventDefault();
      const selectedText = this.getSelectedText();
      const linkMarkdown = `[${selectedText}](${pastedText})`;
      this.insertText(linkMarkdown);
      return;
    }

    // Check if we have rich text (HTML) content
    if (pastedHtml && pastedHtml.trim() !== "") {
      event.preventDefault();
      try {
        const markdown = window.turndownService.turndown(pastedHtml);
        this.insertText(markdown);
      } catch (error) {
        console.error("Error converting HTML to Markdown:", error);
        this.insertText(pastedText);
      }
      return;
    }
  }

  // Shortcuts configuration
  shortcuts = {
    b: () => this.wrapSelection("**", "**"),
    i: () => this.wrapSelection("*", "*"),
    k: () => this.wrapSelection("[", "](url)"),
    "`": () => this.wrapSelection("`", "`"),
    s: () => this.wrapSelection("~~", "~~"),
    q: () => this.insertAtLineStart("> "),
    1: () => this.insertAtLineStart("# "),
    2: () => this.insertAtLineStart("## "),
    3: () => this.insertAtLineStart("### "),
    4: () => this.insertAtLineStart("#### "),
    5: () => this.insertAtLineStart("##### "),
    6: () => this.insertAtLineStart("###### "),
    l: () => this.insertAtLineStart("- "),
    o: () => this.insertAtLineStart("1. "),
    c: () => this.insertCodeBlock(),
    h: () => this.insertHorizontalRule(),
    u: () => this.wrapSelection("<u>", "</u>"),
    m: () => this.insertImage(),
    t: () => this.insertTable(),
  };

  // Utility methods
  insertText(text) {
    document.execCommand("insertText", false, text);
  }

  wrapSelection(prefix, suffix) {
    const selectedText = this.getSelectedText();
    if (selectedText) {
      this.insertText(prefix + selectedText + suffix);
    } else {
      this.insertText(prefix + suffix);
      const cursorPos = this.textarea.selectionStart;
      const newCursorPos = cursorPos - suffix.length;
      this.textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
  }

  insertAtCursor(text) {
    this.insertText(text);
  }

  insertAtLineStart(text) {
    const cursorPos = this.textarea.selectionStart;
    const currentValue = this.textarea.value;

    let lineStart = cursorPos;
    while (lineStart > 0 && currentValue[lineStart - 1] !== "\n") {
      lineStart--;
    }

    this.textarea.setSelectionRange(lineStart, lineStart);
    this.insertText(text);
  }

  insertCodeBlock() {
    this.insertText("\n```\n\n```\n");
    const cursorPos = this.textarea.selectionStart;
    const newCursorPos = cursorPos - 4;
    this.textarea.setSelectionRange(newCursorPos, newCursorPos);
  }

  insertHorizontalRule() {
    this.insertText("\n---\n");
  }

  insertImage() {
    const selectedText = this.getSelectedText();
    if (selectedText) {
      this.insertText(`![${selectedText}](image-url)`);
    } else {
      this.insertText("![alt text](image-url)");
    }
  }

  insertTable() {
    const table =
      "\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n";
    this.insertText(table);
  }

  handleEnterKey(event) {
    const cursorPos = this.textarea.selectionStart;
    const currentValue = this.textarea.value;

    let lineStart = cursorPos;
    while (lineStart > 0 && currentValue[lineStart - 1] !== "\n") {
      lineStart--;
    }

    const currentLine = currentValue.substring(lineStart, cursorPos);

    const bulletMatch = currentLine.match(/^(\s*)([-*+])\s/);
    const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
    const quoteMatch = currentLine.match(/^(\s*)(>)\s/);

    if (bulletMatch) {
      event.preventDefault();
      const indent = bulletMatch[1];
      const bullet = bulletMatch[2];
      this.insertText(`\n${indent}${bullet} `);
    } else if (numberMatch) {
      event.preventDefault();
      const indent = numberMatch[1];
      const number = parseInt(numberMatch[2]) + 1;
      this.insertText(`\n${indent}${number}. `);
    } else if (quoteMatch) {
      event.preventDefault();
      const indent = quoteMatch[1];
      this.insertText(`\n${indent}> `);
    }
  }

  getSelectedText() {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    return this.textarea.value.substring(start, end);
  }

  hasSelection() {
    return this.textarea.selectionStart !== this.textarea.selectionEnd;
  }

  isUrl(text) {
    const urlPattern = /^(https?:\/\/|www\.)/i;
    return urlPattern.test(text.trim());
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = KeyboardShortcuts;
}
