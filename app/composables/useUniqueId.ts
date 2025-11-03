import { ref, onMounted } from 'vue'

// Contador global para garantir IDs únicos mesmo durante SSR
let idCounter = 0

/**
 * Generates a unique ID that is safe for SSR
 * Uses an incremental counter for SSR and enhances with random string on client
 * @param prefix - Optional prefix for the ID
 * @returns A reactive ID string that's SSR-safe
 */
export function useUniqueId(prefix = 'id') {
  // Create unique ID immediately using counter
  const id = ++idCounter
  const uniqueId = ref(`${prefix}-${id}`)
  
  // Enhance with random string on client side for extra uniqueness
  onMounted(() => {
    uniqueId.value = `${prefix}-${id}-${Math.random().toString(36).substr(2, 9)}`
  })
  
  return uniqueId
}