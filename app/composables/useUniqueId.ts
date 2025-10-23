import { ref, onMounted } from 'vue'

/**
 * Generates a unique ID that is safe for SSR
 * Uses a fallback ID for SSR and generates a unique ID on client mount
 * @param prefix - Optional prefix for the ID
 * @returns A reactive ID string that's SSR-safe
 */
export function useUniqueId(prefix = 'id') {
  // Start with a simple deterministic ID for SSR
  const uniqueId = ref(`${prefix}-ssr`)
  
  // Replace with a truly unique ID only on client side
  onMounted(() => {
    uniqueId.value = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  })
  
  return uniqueId
}