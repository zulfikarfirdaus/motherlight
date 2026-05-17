import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /^(?!.*\._).*safari-deploy\.spec\.js$/,
  timeout: 180000,
  retries: 0,
  reporter: [['list']],
  use: {
    headless: false,
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'safari',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
