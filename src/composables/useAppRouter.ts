import _router from '@/router'

export function useAppRouter() {
  const router = useRouter() ?? _router
  const route = useRoute() ?? _router.currentRoute.value

  function pushStack(to: string, query: Record<string, any> = {}) {
    const path = route.path
    const currentPathEndsWithSlash = path.endsWith('/')
    router.push({
      path: `${currentPathEndsWithSlash ? path.slice(0, -1) : path}/${to}`,
      query: {
        ...route.query,
        ...query,
      },
    })
  }

  /**
   * 在setup里用这个一样的： `router.push('./newStack')`
   */
  function backStack(newStack = '', keepQuery = false) {
    const path = route.path.replace(/\/[^/]+$/, newStack)
    if (keepQuery) {
      router.replace({
        path,
        query: {
          ...route.query,
        },
      })
    } else {
      router.replace(path)
    }
  }

  return {
    route,
    router,
    pushStack,
    backStack,
  }
}
