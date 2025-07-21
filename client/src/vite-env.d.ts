/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const src: string
  export default src
}

declare module '*.svg?url' {
  const src: string
  export default src
}

declare module '*.svg?component' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
