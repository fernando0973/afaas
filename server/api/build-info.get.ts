import { useRuntimeConfig } from '#imports'

interface BuildInfo {
  commitHash: string
  commitShort: string
  commitDate: string
  commitMessage: string
  commitAuthor: string
  branch: string
  buildTimestamp: string
}
const DEFAULT_BUILD_INFO: BuildInfo = {
  commitHash: 'indisponível',
  commitShort: 'indisponível',
  commitDate: 'indisponível',
  commitMessage: 'Não foi possível obter mensagem do commit',
  commitAuthor: 'Indisponível',
  branch: 'indisponível',
  buildTimestamp: new Date().toISOString()
}

export default defineEventHandler(() => {
  const { buildInfo } = useRuntimeConfig()
  return (buildInfo as BuildInfo | undefined) ?? DEFAULT_BUILD_INFO
})
