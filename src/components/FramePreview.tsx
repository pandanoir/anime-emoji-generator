import { ComponentProps, useRef, useEffect } from 'react';
import { drawImageFrame, drawTextFrame } from '../functions/drawFrame';
import type { AnimationFrame } from '../types/AnimationFrame';

export const FramePreview = ({
  frame,
  stretchSetting,
  fontFamily,
  ...props
}: {
  frame: AnimationFrame;
  stretchSetting: string;
  fontFamily: string;
} & ComponentProps<'canvas'>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (frame.imageSrc) {
      drawImageFrame(canvasRef.current, frame.imageSrc);
    } else
      drawTextFrame(
        canvasRef.current,
        frame.text,
        frame.style,
        stretchSetting,
        fontFamily,
      );
  }, [frame.text, frame.style, frame.imageSrc, stretchSetting, fontFamily]);

  return (
    <canvas
      ref={canvasRef}
      width="100"
      height="100"
      style={{
        border: '1px solid var(--mantine-color-dark-0)',
        borderRadius: 'var(--mantine-radius-sm)',
      }}
      {...props}
    />
  );
};
