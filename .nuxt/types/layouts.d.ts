import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "admin-layout" | "default"
declare module "C:/Users/AliAkbar/PhpstormProjects/zero-front/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}