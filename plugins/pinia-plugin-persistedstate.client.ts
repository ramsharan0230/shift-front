import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  // Ensure $pinia is available
  if ($pinia) {
    $pinia.use(piniaPluginPersistedstate)
  } else {
    console.error('Pinia instance is not available at plugin load time.')
  }
})
