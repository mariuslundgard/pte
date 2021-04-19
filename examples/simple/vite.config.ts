import path from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'
import {defineConfig} from 'vite'

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'dist'),
  },
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      {
        find: 'pte',
        replacement: path.resolve(__dirname, '../../packages/pte/src'),
      },
      {
        find: 'react-pte',
        replacement: path.resolve(__dirname, '../../packages/react-pte/src'),
      },
    ],
  },
  root: path.resolve(__dirname, 'src'),
  server: {
    port: 3333,
  },
})
