export async function drawTextFrame(
  canvas: HTMLCanvasElement,
  text: string,
  style: { color: string; bold: boolean },
  stretchSetting: string,
  fontFamily: string,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (!document.fonts.check(`16px "${fontFamily}"`)) {
    await document.fonts.load(`16px "${fontFamily}"`);
  }

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const lines = text.split('\n');
  const lineHeight = canvas.height / lines.length;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    ctx.fillStyle = style.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize =
      stretchSetting === 'alignsFontSize' // フォントサイズを揃える
        ? Math.min(
          lineHeight,
          ...lines.map((line) => canvas.width / [...line].length),
        )
        : stretchSetting === 'doesNotStretch' // ストレッチさせない
          ? Math.min(canvas.width / [...line].length, lineHeight)
          : stretchSetting === 'fitsLineHeight' // 行間にフィットさせる
            ? lineHeight
            : '';
    ctx.font = `${style.bold ? 'bold' : ''} ${fontSize}px ${fontFamily}`;
    ctx.fillText(
      line,
      canvas.width / 2,
      lineHeight * i + lineHeight / 2,
      canvas.width,
    );
  }
}

const imageCache = new Map<string, HTMLImageElement>();
export function drawImageFrame(canvas: HTMLCanvasElement, imageSrc: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cache = imageCache.get(imageSrc);
  if (cache) {
    ctx.drawImage(cache, 0, 0, canvas.width, canvas.height);
    return;
  }
  return new Promise<void>((resolve) => {
    const img = new Image();
    imageCache.set(imageSrc, img);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    img.src = imageSrc;
  });
}
