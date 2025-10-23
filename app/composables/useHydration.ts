/**
 * Composable para gerenciar estado de hidratação seguro
 */
export const useSafeHydration = () => {
  const isHydrated = ref(false)
  
  onMounted(() => {
    isHydrated.value = true
  })
  
  // Computed que só retorna true depois da hidratação
  const isSafeToShow = computed(() => {
    return process.client && isHydrated.value
  })
  
  // Função helper para valores seguros
  const safeValue = <T>(clientValue: T, fallback: T): T => {
    return isSafeToShow.value ? clientValue : fallback
  }
  
  return {
    isHydrated: readonly(isHydrated),
    isSafeToShow,
    safeValue
  }
}