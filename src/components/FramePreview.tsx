import { ComponentProps, useRef, useEffect } from 'react';
import { drawFrame } from '../functions/drawFrame';

export const FramePreview = ({
  text,
  style,
  stretchSetting,
  fontFamily,
  ...props
}: {
  text: string;
  style: { color: string; bold: boolean };
  stretchSetting: string;
  fontFamily: string;
} & ComponentProps<'canvas'>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    drawFrame(canvasRef.current, text, style, stretchSetting, fontFamily);
  }, [text, style, stretchSetting, fontFamily]);

  return <canvas ref={canvasRef} width="100" height="100" {...props} />;
};
