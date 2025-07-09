import { useEffect, RefObject } from "react";
import TurndownService from "turndown";

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

export const useKeyboardShortcuts = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  onMarkdownChange: (markdown: string) => void
) => {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    const insertText = (text: string) => {
      document.execCommand("insertText", false, text);
    };

    const getSelectedText = () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      return textarea.value.substring(start, end);
    };

    const hasSelection = () => {
      return textarea.selectionStart !== textarea.selectionEnd;
    };

    const wrapSelection = (prefix: string, suffix: string) => {
      const selectedText = getSelectedText();
      if (selectedText) {
        insertText(prefix + selectedText + suffix);
      } else {
        insertText(prefix + suffix);
        const cursorPos = textarea.selectionStart;
        const newCursorPos = cursorPos - suffix.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    };

    const insertAtLineStart = (text: string) => {
      const cursorPos = textarea.selectionStart;
      const currentValue = textarea.value;

      let lineStart = cursorPos;
      while (lineStart > 0 && currentValue[lineStart - 1] !== "\n") {
        lineStart--;
      }

      textarea.setSelectionRange(lineStart, lineStart);
      insertText(text);
    };

    const insertCodeBlock = () => {
      insertText("\n```\n\n```\n");
      const cursorPos = textarea.selectionStart;
      const newCursorPos = cursorPos - 4;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    };

    const insertHorizontalRule = () => {
      insertText("\n---\n");
    };

    const insertImage = () => {
      const selectedText = getSelectedText();
      if (selectedText) {
        insertText(`![${selectedText}](image-url)`);
      } else {
        insertText("![alt text](image-url)");
      }
    };

    const insertTable = () => {
      const table =
        "\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n";
      insertText(table);
    };

    const handleEnterKey = (event: KeyboardEvent) => {
      const cursorPos = textarea.selectionStart;
      const currentValue = textarea.value;

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
        insertText(`\n${indent}${bullet} `);
      } else if (numberMatch) {
        event.preventDefault();
        const indent = numberMatch[1];
        const number = parseInt(numberMatch[2]) + 1;
        insertText(`\n${indent}${number}. `);
      } else if (quoteMatch) {
        event.preventDefault();
        const indent = quoteMatch[1];
        insertText(`\n${indent}> `);
      }
    };

    const shortcuts: Record<string, () => void> = {
      b: () => wrapSelection("**", "**"),
      i: () => wrapSelection("*", "*"),
      k: () => wrapSelection("[", "](url)"),
      "`": () => wrapSelection("`", "`"),
      s: () => wrapSelection("~~", "~~"),
      q: () => insertAtLineStart("> "),
      "1": () => insertAtLineStart("# "),
      "2": () => insertAtLineStart("## "),
      "3": () => insertAtLineStart("### "),
      "4": () => insertAtLineStart("#### "),
      "5": () => insertAtLineStart("##### "),
      "6": () => insertAtLineStart("###### "),
      l: () => insertAtLineStart("- "),
      o: () => insertAtLineStart("1. "),
      c: () => insertCodeBlock(),
      h: () => insertHorizontalRule(),
      u: () => wrapSelection("<u>", "</u>"),
      m: () => insertImage(),
      t: () => insertTable(),
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Handle Cmd/Ctrl + key combinations
      if (cmdOrCtrl && !event.shiftKey && !event.altKey) {
        const key = event.key.toLowerCase();
        const shortcut = shortcuts[key];

        if (shortcut) {
          event.preventDefault();
          shortcut();
          return;
        }
      }

      // Handle Tab key
      if (
        event.key === "Tab" &&
        !event.shiftKey &&
        !cmdOrCtrl &&
        !event.altKey
      ) {
        event.preventDefault();
        insertText("    ");
        return;
      }

      // Handle Shift + Tab
      if (
        event.shiftKey &&
        event.key === "Tab" &&
        !cmdOrCtrl &&
        !event.altKey
      ) {
        event.preventDefault();
        insertText("    ");
        return;
      }

      // Handle Enter for smart list continuation
      if (event.key === "Enter" && !cmdOrCtrl && !event.altKey) {
        handleEnterKey(event);
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const pastedText = clipboardData.getData("text");
      const pastedHtml = clipboardData.getData("text/html");

      // Check if pasted text looks like a URL and we have text selected
      if (isUrl(pastedText) && hasSelection()) {
        event.preventDefault();
        const selectedText = getSelectedText();
        const linkMarkdown = `[${selectedText}](${pastedText})`;
        insertText(linkMarkdown);
        return;
      }

      // Check if we have rich text (HTML) content
      if (pastedHtml && pastedHtml.trim() !== "") {
        event.preventDefault();
        try {
          const markdown = turndownService.turndown(pastedHtml);
          insertText(markdown);
        } catch (error) {
          console.error("Error converting HTML to Markdown:", error);
          insertText(pastedText);
        }
        return;
      }
    };

    const isUrl = (text: string) => {
      const urlPattern = /^(https?:\/\/|www\.)/i;
      return urlPattern.test(text.trim());
    };

    textarea.addEventListener("keydown", handleKeydown);
    textarea.addEventListener("paste", handlePaste);

    return () => {
      textarea.removeEventListener("keydown", handleKeydown);
      textarea.removeEventListener("paste", handlePaste);
    };
  }, [textareaRef, onMarkdownChange]);
};
