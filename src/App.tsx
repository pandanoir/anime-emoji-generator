import { useState } from 'react';
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
import { LuCopy } from 'react-icons/lu';
import { notifications } from '@mantine/notifications';
import { exportFile } from './functions/exportFile';
import { generateGif } from './functions/generateGif';
import { AnimationPreview } from './components/AnimationPreview';
import { FramePreview } from './components/FramePreview';
import { PopoverColorPicker } from './components/PopoverColorPicker';
import { AnimationFrame } from './types/AnimationFrame';
import { drawFrame } from './functions/drawFrame';
import { sample } from './functions/sample';

const colorfulSwatches = [...Array(10).keys()].map(
  (i) => `hsl(${(360 / 10) * i}, 80%, 60%)`,
);
const swatches = ['white', ...colorfulSwatches, 'gray', 'black'];

export function App() {
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>(
    () => [
      {
        text: '',
        style: { color: sample(colorfulSwatches), bold: true },
        pickedColor: '',
        id: 0,
      },
    ],
  );
  const [stretchSetting, setStretchSetting] = useState('fitsLineHeight');
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [duration, setDuration] = useState(500);

  return (
    <Container size="lg">
      <Stack gap={32} align="start">
        <Card withBorder p="md">
          <Flex gap="lg" rowGap={32} align="stretch" wrap="wrap">
            {animationFrames.map((frame, i) => (
              <Stack gap="xs" key={frame.id}>
                <Flex>
                  {frame.text.split('\n\n').map((text, i) => (
                    <FramePreview
                      key={i}
                      text={text}
                      style={frame.style}
                      stretchSetting={stretchSetting}
                      fontFamily={fontFamily}
                    />
                  ))}
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
                    {swatches.map((color) => (
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
                        {frame.style.color === color && <CheckIcon size={12} />}
                      </ColorSwatch>
                    ))}
                    <PopoverColorPicker
                      color={frame.pickedColor}
                      onClick={() =>
                        setAnimationFrames((frames) =>
                          frames.with(i, {
                            ...frame,
                            style: { ...frame.style, color: frame.pickedColor },
                          }),
                        )
                      }
                      onChange={(value) =>
                        setAnimationFrames((frames) =>
                          frames.with(i, {
                            ...frame,
                            style: { ...frame.style, color: value },
                            pickedColor: value,
                          }),
                        )
                      }
                    >
                      {frame.style.color === frame.pickedColor && (
                        <CheckIcon size={12} />
                      )}
                    </PopoverColorPicker>
                  </SimpleGrid>
                  {animationFrames.length > 1 && (
                    <Button
                      variant="outline"
                      leftSection={<LuCopy />}
                      onClick={() => {
                        setAnimationFrames((frames) =>
                          frames.map((x) => ({
                            ...x,
                            style: { ...x.style, color: frame.style.color },
                            pickedColor: frame.pickedColor,
                          })),
                        );
                        const id = notifications.show({
                          autoClose: 8000,
                          message: (
                            <Flex gap="sm" align="center">
                              色設定を全てに反映させました
                              <Button
                                onClick={() => {
                                  setAnimationFrames(animationFrames);
                                  notifications.hide(id);
                                }}
                              >
                                戻す
                              </Button>
                            </Flex>
                          ),
                        });
                      }}
                    >
                      この色に全て変更
                    </Button>
                  )}
                </Card>
                {animationFrames.length > 1 && (
                  <Button
                    leftSection={<FaTrashAlt />}
                    variant="danger-outline"
                    style={{ width: 'max-content' }}
                    onClick={() => {
                      setAnimationFrames((frames) =>
                        frames.filter((x) => x.id !== frame.id),
                      );
                      const id = notifications.show({
                        autoClose: 8000,
                        message: (
                          <Flex gap="sm" align="center">
                            {frame.text}を削除しました
                            <Button
                              onClick={() => {
                                setAnimationFrames(animationFrames);
                                notifications.hide(id);
                              }}
                            >
                              戻す
                            </Button>
                          </Flex>
                        ),
                      });
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
                        color: sample(colorfulSwatches),
                        bold: true,
                        ...frames.at(-1)?.style,
                      },
                      pickedColor: frames.at(-1)?.pickedColor || '',
                      id: (frames.at(-1)?.id ?? 0) + 1,
                    },
                  ]);
                }}
              >
                <FaPlus />
              </Button>
            </div>
          </Flex>
        </Card>

        <Flex gap="sm" align="stretch">
          <Card withBorder>
            <Text fw="bold">プレビュー</Text>
            <AnimationPreview
              frames={animationFrames}
              stretchSetting={stretchSetting}
              fontFamily={fontFamily}
              duration={duration}
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

                  exportFile(
                    new Blob([
                      generateGif(
                        animationFrames
                          .flatMap((frame) =>
                            frame.text
                              .split('\n\n')
                              .map((text) => ({ ...frame, text })),
                          )
                          .map(({ text, style }) => {
                            drawFrame(
                              canvas,
                              text,
                              style,
                              stretchSetting,
                              fontFamily,
                            );
                            return ctx.getImageData(
                              0,
                              0,
                              canvas.width,
                              canvas.height,
                            ).data;
                          }),
                        canvas.width,
                        canvas.height,
                        duration,
                      ) as Uint8Array<ArrayBuffer>,
                    ]),
                    `${animationFrames.map(({ text }) => text.replaceAll('\n', '')).join('_')}.gif`,
                  );
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
