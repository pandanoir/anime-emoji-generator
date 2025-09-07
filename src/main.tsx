import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Button, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import buttonClasses from './Button.module.css';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  cursorType: 'pointer',
  components: {
    Button: Button.extend({
      classNames: buttonClasses,
    }),
  },
});

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <App />
        <Notifications />
      </MantineProvider>
    </StrictMode>,
  );
}
