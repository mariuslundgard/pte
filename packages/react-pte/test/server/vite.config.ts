import path from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      {
        find: 'pte',
        replacement: path.resolve(__dirname, '../../../pte/src'),
      },
      {
        find: 'react-pte',
        replacement: path.resolve(__dirname, '../../src'),
      },
    ],
  },
})
