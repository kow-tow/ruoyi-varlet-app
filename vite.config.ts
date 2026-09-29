import { fileURLToPath, URL } from 'node:url'
import { VarletImportResolver } from '@varlet/import-resolver'
import icon from '@varlet/unplugin-icon-builder/vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import unoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { EditableTreeNode } from 'unplugin-vue-router/types'
import vueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import layouts from 'vite-plugin-vue-layouts'

interface StackRoute {
  name: string
  children?: StackRoute[]
}

function extendRoute(route: EditableTreeNode) {
  const stacks = (route.meta?.stacks ?? []) as StackRoute[]

  processStacks(route, stacks)

  function processStacks(route: EditableTreeNode, stacks: (StackRoute | string)[]) {
    stacks.forEach((stack) => {
      const isStringifyStack = typeof stack === 'string'
      const name = isStringifyStack ? stack : stack.name
      const newRoute = route.insert(name, `/src/stacks/${name}.vue`)

      if (!isStringifyStack && stack.children) {
        processStacks(newRoute, stack.children)
      }
    })
  }
}

const PROXY_TARGET = 'http://127.0.0.1:8080'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 10087,
    proxy: {
      // https://cn.vitejs.dev/config/#server-proxy
      '/dev-api': {
        target: PROXY_TARGET,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev-api/, ''),
        ws: true,
      },
      // springdoc proxy
      '^/v3/api-docs/(.*)': {
        target: PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },

  build: {
    target: ['ios12'],
  },

  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          img: ['src'],
          video: ['src'],
          audio: ['src'],
          'var-image': ['src'],
          'var-avatar': ['src'],
          'var-card': ['src'],
          'var-app-bar': ['image'],
        },
      },
    }),

    layouts(),

    vueRouter({
      routesFolder: [
        {
          src: 'src/pages',
        },
        {
          src: 'src/stacks',
          path: 'stacks/',
        },
      ],
      exclude: ['**/components/**', '**/composables/**', '**/lib/**'],
      extendRoute,
    }),

    jsx(),

    icon({ dir: 'src/assets/icons', onDemand: true }),

    components({
      resolvers: [VarletImportResolver()],
    }),

    autoImport({
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      dirs: ['./src/composables', './src/stores'],
      eslintrc: { enabled: true },
      resolvers: [VarletImportResolver({ autoImport: true })],
    }),

    unoCSS(),
  ],
})
