import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwind from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwind(), tsconfigPaths()],
})
