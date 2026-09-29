import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...setupLayouts(routes),
    {
      path: '/:catchAll(.*)/sign-in',
      redirect: '/home/sign-in',
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/home',
    },
  ],
})

export default router
