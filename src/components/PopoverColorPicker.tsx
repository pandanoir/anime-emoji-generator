import { Popover, ColorSwatch, ColorPicker } from '@mantine/core';
import { PropsWithChildren } from 'react';

export const PopoverColorPicker = ({
  color,
  onChange,
  onClick,
  children,
}: PropsWithChildren<{
  color: string;
  onChange: (value: string) => void;
  onClick: () => void;
}>) => (
  <Popover width={200} position="bottom" withArrow shadow="md">
    <Popover.Target>
      <ColorSwatch
        component="button"
        color={color}
        style={{ color: '#fff', cursor: 'pointer' }}
        onClick={onClick}
      >
        {children}
      </ColorSwatch>
    </Popover.Target>
    <Popover.Dropdown>
      <ColorPicker onChange={onChange} />
    </Popover.Dropdown>
  </Popover>
);
