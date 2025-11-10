import { execSync } from 'node:child_process'

interface BuildInfo {
  commitHash: string
  commitShort: string
  commitDate: string
  commitMessage: string
  commitAuthor: string
  branch: string
  buildTimestamp: string
}

let cachedBuildInfo: BuildInfo | null = null

function getGitOutput(command: string): string {
  return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
}

function loadBuildInfo(): BuildInfo {
  if (cachedBuildInfo) {
    return cachedBuildInfo
  }

  try {
    const commitHash = getGitOutput('git rev-parse HEAD')
    const commitShort = getGitOutput('git rev-parse --short HEAD')
    const commitDate = getGitOutput('git log -1 --format=%cI')
    const commitMessage = getGitOutput('git log -1 --format=%s')
    const commitAuthor = getGitOutput('git log -1 --format=%an')
    const branch = getGitOutput('git rev-parse --abbrev-ref HEAD')
    const buildTimestamp = new Date().toISOString()

    cachedBuildInfo = {
      commitHash,
      commitShort,
      commitDate,
      commitMessage,
      commitAuthor,
      branch,
      buildTimestamp
    }

    return cachedBuildInfo
  } catch (error) {
    cachedBuildInfo = {
      commitHash: 'indisponível',
      commitShort: 'indisponível',
      commitDate: 'indisponível',
      commitMessage: 'Não foi possível obter mensagem do commit',
      commitAuthor: 'Indisponível',
      branch: 'indisponível',
      buildTimestamp: new Date().toISOString()
    }

    return cachedBuildInfo
  }
}

export default defineEventHandler(() => {
  return loadBuildInfo()
})
