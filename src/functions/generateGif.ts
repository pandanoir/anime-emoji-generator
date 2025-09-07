import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export function generateGif(
  frames: ImageDataArray[],
  width: number,
  height: number,
  duration: number,
) {
  const gif = GIFEncoder();
  for (const data of frames) {
    const palette = quantize(data, 256);
    gif.writeFrame(applyPalette(data, palette), width, height, {
      palette,
      delay: duration,
    });
  }
  gif.finish();
  return gif.bytes();
}
