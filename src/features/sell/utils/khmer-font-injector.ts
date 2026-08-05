import {
  KHMER_FONT_REGULAR_BASE64,
  KHMER_FONT_BOLD_BASE64,
} from './khmer-fonts';

let fontFaceInjected = false;

export function ensureFontFaceInjected() {
  if (fontFaceInjected || typeof document === 'undefined') return;
  try {
    const styleId = 'khmer-suwannaphum-font';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @font-face {
          font-family: 'Suwannaphum';
          src: url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_REGULAR_BASE64}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Suwannaphum';
          src: url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_BOLD_BASE64}) format('truetype');
          font-weight: bold;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);
    }

    if ('FontFace' in window && 'fonts' in document) {
      const reg = new FontFace(
        'Suwannaphum',
        `url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_REGULAR_BASE64})`,
      );
      const bold = new FontFace(
        'Suwannaphum',
        `url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_BOLD_BASE64})`,
        { weight: 'bold' },
      );
      const fontsSet = document.fonts as unknown as Set<FontFace>;
      reg
        .load()
        .then((f) => fontsSet.add(f))
        .catch(() => {});
      bold
        .load()
        .then((f) => fontsSet.add(f))
        .catch(() => {});
    }
    fontFaceInjected = true;
  } catch (e) {
    console.warn('Could not inject FontFace:', e);
  }
}
