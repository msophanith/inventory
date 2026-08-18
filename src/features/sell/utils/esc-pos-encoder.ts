export class EscPosEncoder {
  private buffer: number[] = [];
  private maxCharsPerLine = 32;

  constructor(maxCharsPerLine: number = 32) {
    this.maxCharsPerLine = maxCharsPerLine;
  }

  // Helper to convert string to bytes (ASCII)
  private stringToBytes(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      // Basic ASCII encoding. For complex characters (like Khmer), 
      // the printer needs specific code page support or image printing.
      // For now, we sanitize to basic printable ASCII or raw bytes.
      const charCode = str.charCodeAt(i);
      // Fallback for non-ASCII if needed, but standard thermal printers require specific code pages.
      bytes.push(charCode > 255 ? 63 : charCode); // 63 is '?'
    }
    return bytes;
  }

  public initialize(): this {
    this.buffer.push(0x1b, 0x40);
    return this;
  }

  public text(str: string): this {
    this.buffer.push(...this.stringToBytes(str));
    return this;
  }

  public line(str: string = ''): this {
    this.text(str);
    this.buffer.push(0x0a);
    return this;
  }

  public align(alignment: 'left' | 'center' | 'right'): this {
    const alignMap = { left: 0, center: 1, right: 2 };
    this.buffer.push(0x1b, 0x61, alignMap[alignment]);
    return this;
  }

  public bold(enabled: boolean): this {
    this.buffer.push(0x1b, 0x45, enabled ? 1 : 0);
    return this;
  }

  public size(width: 1 | 2, height: 1 | 2): this {
    // GS ! n (where n is combination of width and height multipliers)
    const n = ((width - 1) << 4) | (height - 1);
    this.buffer.push(0x1d, 0x21, n);
    return this;
  }

  public cut(): this {
    // Feed 4 lines then partial cut
    this.buffer.push(0x1d, 0x56, 0x42, 0x00);
    return this;
  }

  // Layout helpers
  public row(left: string, right: string, charLimit?: number): this {
    const limit = charLimit || this.maxCharsPerLine;
    const spaceCount = limit - left.length - right.length;
    
    if (spaceCount > 0) {
      this.line(left + ' '.repeat(spaceCount) + right);
    } else {
      // If it overflows, just put right on next line aligned right
      this.line(left);
      this.align('right').line(right).align('left');
    }
    return this;
  }

  public divider(): this {
    this.line('-'.repeat(this.maxCharsPerLine));
    return this;
  }

  public encode(): Uint8Array {
    return new Uint8Array(this.buffer);
  }
}
