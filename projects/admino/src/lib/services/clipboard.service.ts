import { Injectable } from "@angular/core";

export class PendingCopy {
  private _textarea: HTMLTextAreaElement | undefined;

  constructor(text: string, private readonly _document: Document) {
    const textarea = (this._textarea = this._document.createElement(
      "textarea"
    ));
    const styles = textarea.style;

    // Hide the element for display and accessibility. Set an
    // absolute position so the page layout isn't affected.
    styles.opacity = "0";
    styles.position = "absolute";
    styles.left = styles.top = "-999em";
    textarea.setAttribute("aria-hidden", "true");
    textarea.value = text;
    this._document.body.appendChild(textarea);
  }

  /** Finishes copying the text. */
  copy(): boolean {
    const textarea = this._textarea;
    let successful = false;

    try {
      // Older browsers could throw if copy is not supported.
      if (textarea) {
        const currentFocus = this._document.activeElement as any;

        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        successful = this._document.execCommand("copy");

        if (currentFocus) {
          currentFocus.focus();
        }
      }
    } catch {
      // Discard error.
      // Initial setting of {@code successful} will represent failure here.
    }

    return successful;
  }

  /** Cleans up DOM changes used to perform the copy operation. */
  destroy() {
    const textarea = this._textarea;

    if (textarea) {
      if (textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }

      this._textarea = undefined;
    }
  }
}

@Injectable({
  providedIn: "root",
})
export class ClipboardService {
  constructor() {}

  copy(text: string): boolean {
    const pendingCopy = this.beginCopy(text);
    const successful = pendingCopy.copy();
    pendingCopy.destroy();
    return successful;
  }

  beginCopy(text: string): PendingCopy {
    return new PendingCopy(text, document);
  }
}
