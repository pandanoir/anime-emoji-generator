import { useState, useEffect, useMemo } from 'react';
import { FramePreview } from './FramePreview';
import { AnimationFrame } from '../types/AnimationFrame';

export const AnimationPreview = ({
  frames: _frames,
  stretchSetting,
  fontFamily,
  duration,
}: {
  frames: AnimationFrame[];
  stretchSetting: string;
  fontFamily: string;
  duration: number;
}) => {
  const [previewedFrame, setPreviewedFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPreviewedFrame((n) => n + 1);
    }, duration);
    return () => clearInterval(id);
  }, [duration]);
  const frames = useMemo(
    () =>
      _frames.flatMap((frame) =>
        frame.text.split('\n\n').map((text) => ({ ...frame, text })),
      ),
    [_frames],
  );

  return (
    <FramePreview
      style={frames[previewedFrame % frames.length].style}
      stretchSetting={stretchSetting}
      text={frames[previewedFrame % frames.length].text}
      fontFamily={fontFamily}
      width="200"
      height="200"
    />
  );
};
