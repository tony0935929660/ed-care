import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // https://vitejs.dev/config/shared-options.html#resolve-alias
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  //启动服务配置
  server: {
    port: 3000,
    strictPort: true,
    open: false,
    hmr: true,
    cors: true, // 允许跨域
    proxy: {
      "/apidata": {
        target: "https://edcare-home.serveirc.com",
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apidata/, "")
      },
    }
  },
})
