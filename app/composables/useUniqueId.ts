/**
 * Generates a unique ID that is safe for SSR
 * Creates static IDs that are the same between server and client
 */

let idCounter = 0

export function useUniqueId(prefix = 'input') {
  // Create ID immediately when function is called
  const id = `${prefix}-${++idCounter}`
  
  // Return ref with the static ID
  return ref(id)
}

// Reset counter function (useful for testing)
export function resetIdCounter() {
  idCounter = 0
}