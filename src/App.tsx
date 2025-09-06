import { ComponentProps, useEffect, useRef, useState } from 'react';
import { applyPalette, GIFEncoder, quantize } from 'gifenc';
import {
  Button,
  Card,
  Checkbox,
  CheckIcon,
  ColorSwatch,
  Container,
  Flex,
  NativeSelect,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { MdDownload } from 'react-icons/md';

async function drawFrame(
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

const FramePreview = ({
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
export function App() {
  const [previewedFrame, setPreviewedFrame] = useState(0);

  const [animationFrames, setAnimationFrames] = useState<
    {
      text: string;
      style: { color: string; bold: boolean };
      id: number;
    }[]
  >(() => [
    {
      text: '',
      style: {
        color: `hsl(${(360 / 10) * Math.trunc(Math.random() * 10)}, 80%, 60%)`,
        bold: true,
      },
      id: 0,
    },
  ]);
  const [stretchSetting, setStretchSetting] = useState('fitsLineHeight');
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [duration, setDuration] = useState(500);
  useEffect(() => {
    const id = setInterval(() => {
      setPreviewedFrame((n) => n + 1);
    }, duration);
    return () => clearInterval(id);
  }, [duration]);

  return (
    <Container>
      <Stack gap={32} align="start">
        <Flex gap="lg" rowGap={32} align="stretch" wrap="wrap" bg="white">
          {animationFrames.map((frame, i) => (
            <Stack gap="xs" key={frame.id}>
              <Flex>
                <FramePreview
                  text={frame.text}
                  style={frame.style}
                  stretchSetting={stretchSetting}
                  fontFamily={fontFamily}
                />
              </Flex>
              <Flex gap="xs">
                <Textarea
                  value={frame.text}
                  onChange={({ currentTarget: { value } }) =>
                    setAnimationFrames((frames) =>
                      frames.with(i, { ...frame, text: value }),
                    )
                  }
                  autosize
                  resize="both"
                  minRows={3}
                  style={{ width: '7.5rem' }}
                />
                <Checkbox
                  checked={frame.style.bold}
                  onChange={({ currentTarget: { checked } }) =>
                    setAnimationFrames((frames) =>
                      frames.with(i, {
                        ...frame,
                        style: {
                          ...frame.style,
                          bold: checked,
                        },
                      }),
                    )
                  }
                  label="bold"
                />
              </Flex>
              <Card withBorder px={4} py={1}>
                <SimpleGrid cols={7} spacing="xs" verticalSpacing={4} p="xs">
                  {[
                    'white',
                    ...[...Array(10).keys()].map(
                      (i) => `hsl(${(360 / 10) * i}, 80%, 60%)`,
                    ),
                    'gray',
                    'black',
                  ].map((color) => (
                    <ColorSwatch
                      component="button"
                      color={color}
                      onClick={() => {
                        setAnimationFrames((frames) =>
                          frames.with(i, {
                            ...frame,
                            style: { ...frame.style, color },
                          }),
                        );
                      }}
                      style={{ color: '#fff', cursor: 'pointer' }}
                    >
                      {color === frame.style.color && <CheckIcon size={12} />}
                    </ColorSwatch>
                  ))}
                </SimpleGrid>
              </Card>
              {animationFrames.length > 1 && (
                <Button
                  leftSection={<FaTrashAlt />}
                  variant="danger-outline"
                  style={{ width: 'max-content' }}
                  onClick={() => {
                    if (!confirm(`"${frame.text}"を削除しますか?`)) {
                      return;
                    }
                    setAnimationFrames((frames) =>
                      frames.filter((x) => x.id !== frame.id),
                    );
                  }}
                >
                  削除
                </Button>
              )}
            </Stack>
          ))}
          <div>
            <Button
              variant="outline"
              style={{ height: '100%' }}
              onClick={() => {
                setAnimationFrames((frames) => [
                  ...frames,
                  {
                    text: '',
                    style: {
                      color: `hsl(${(360 / 10) * Math.trunc(Math.random() * 10)}, 80%, 60%)`,
                      bold: true,
                      ...frames.at(-1)?.style,
                    },
                    id: (frames.at(-1)?.id ?? 0) + 1,
                  },
                ]);
              }}
            >
              <FaPlus />
            </Button>
          </div>
        </Flex>

        <Flex gap="sm" align="stretch">
          <Card withBorder>
            <Text fw="bold">プレビュー</Text>
            <FramePreview
              style={
                animationFrames[previewedFrame % animationFrames.length].style
              }
              stretchSetting={stretchSetting}
              text={
                animationFrames[previewedFrame % animationFrames.length].text
              }
              fontFamily={fontFamily}
              width="200"
              height="200"
            />
          </Card>

          <Card withBorder>
            <Stack>
              <NativeSelect
                label="文字の縦横比、サイズ"
                value={stretchSetting}
                onChange={(event) =>
                  setStretchSetting(event.currentTarget.value)
                }
                data={[
                  { label: '行間にフィットさせる', value: 'fitsLineHeight' },
                  { label: 'ストレッチさせない', value: 'doesNotStretch' },
                  { label: 'フォントサイズを揃える', value: 'alignsFontSize' },
                ]}
              />
              <NativeSelect
                label="アニメーション速度"
                value={duration}
                onChange={(event) =>
                  setDuration(Number(event.currentTarget.value))
                }
                data={[
                  { label: '速い', value: '250' },
                  { label: 'ふつう', value: '500' },
                  { label: '遅い', value: '750' },
                ]}
              />
              <Radio.Group
                value={fontFamily}
                onChange={(v) => {
                  setFontFamily(v);
                }}
                label="フォント"
              >
                {[
                  'sans-serif',
                  'Kaisei Decol',
                  'Aoboshi One',
                  'Dela Gothic One',
                  'Noto Serif JP',
                ].map((font) => (
                  <Radio
                    key={font}
                    value={font}
                    label={<span style={{ fontFamily: font }}>{font}</span>}
                  />
                ))}
              </Radio.Group>
              <Button
                onClick={() => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 200;
                  canvas.height = 200;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;

                  const gif = GIFEncoder();
                  for (const { text, style } of animationFrames) {
                    drawFrame(canvas, text, style, stretchSetting, fontFamily);
                    const { data } = ctx.getImageData(
                      0,
                      0,
                      canvas.width,
                      canvas.height,
                    );
                    const palette = quantize(data, 256);
                    gif.writeFrame(
                      applyPalette(data, palette),
                      canvas.width,
                      canvas.height,
                      { palette, delay: duration },
                    );
                  }
                  gif.finish();

                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(
                    new Blob([gif.bytes() as Uint8Array<ArrayBuffer>]),
                  );
                  link.download = `${animationFrames.map(({ text }) => text.replaceAll('\n', '')).join('_')}.gif`;
                  link.click();
                }}
                leftSection={<MdDownload />}
              >
                GIFをダウンロード
              </Button>
            </Stack>
          </Card>
        </Flex>
      </Stack>
    </Container>
  );
}
