/**
 * `Object.assign` 青春版
 *  注意 Symbol 不会被assign
 */
export function assign(target?: Record<string, any>, source?: Record<string, any>) {
  if (target && source) {
    for (const entry of Object.entries(source)) {
      if (Object.hasOwn(target, entry[0])) {
        Reflect.set(target, ...entry)
      }
    }
  }
}
