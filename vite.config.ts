import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
// import VueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode })=>{
  return {
    base: command === 'build' && mode === 'github' ? '/apidoc/' : '/',
    // base:'https://example.com',
    plugins: [
      vue(),
      // VueDevTools(),
  
      // 자동 import Element components
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    esbuild: {
      // 프로덕션 환경에서만 console과 debugger 제거
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('src/components/')) {
              return 'components';
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  
    css: {
      preprocessorOptions: {
        // to avoid legacy JS Api Deprecation Warning
        scss: {
          api: 'modern-compiler', // or "modern", "legacy"
        },
      },
    },
  }
})
