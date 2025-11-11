# Build Info — Disponibilizando commit/branch/timestamp em produção (Vercel)

Este documento reúne o contexto, as mudanças realizadas no repositório (commit d521114), por que as informações de build podem aparecer como "indisponível" na Vercel, e instruções passo-a-passo (UI e CLI) para garantir que a API `/api/build-info` e a página de perfil mostrem: data/hora da compilação, branch, último commit (hash), mensagem e autor.

---

## 1) Contexto e commit relevante

- Commit alvo: `d521114`
- Branch: `master`
- Mensagem: `ci(build): add runtimeConfig buildInfo for production + build-info API using runtimeConfig`

Objetivo do commit: calcular e registrar informações de build no momento do `build` (em `nuxt.config.ts`) e disponibilizar essas informações via `runtimeConfig` do Nuxt, para que a rota API `/api/build-info` leia desse runtimeConfig em vez de executar comandos `git` no tempo de execução do servidor.

Por que isso foi necessário: em ambientes serverless (Vercel, Netlify, etc.) o filesystem e o ambiente onde o processo roda podem não ter acesso ao repositório Git no momento da execução (ou o processo de build pode ser executado sem definir as variáveis de metadados do Git). Executar `git` no runtime frequentemente resulta em respostas "indisponível". Pré-computar os valores durante o `build` e persistir no `runtimeConfig` garante disponibilidade em runtime.

---

## 2) O que foi alterado no código (resumo técnico)

1. `nuxt.config.ts`
   - Agora tenta obter metadados do build a partir destas fontes, por ordem de prioridade:
     1. Variáveis de ambiente que a Vercel (ou outra plataforma) define automaticamente, ex.: `VERCEL_GIT_COMMIT_SHA`, `VERCEL_GIT_COMMIT_REF`, `VERCEL_GIT_COMMIT_MESSAGE`, `VERCEL_GIT_COMMIT_AUTHOR_NAME`.
     2. Variáveis manuais definidas (`NUXT_BUILD_*`) — para uso quando a aplicação é publicada sem os metadados Git automáticos.
     3. Fallback: comandos `git` locais (apenas se o repositório estiver disponível no ambiente de build).
   - Cria um objeto `buildInfo` com os campos:
     - commitHash, commitShort, commitDate, commitMessage, commitAuthor, branch, buildTimestamp
   - Expondo estes dados em `runtimeConfig.buildInfo` (server) e um resumo limitado em `runtimeConfig.public.buildInfoPublic` (client-friendly).

2. `server/api/build-info.get.ts`
   - Refatorada para não executar `git` no servidor.
   - Agora lê `useRuntimeConfig().buildInfo` e retorna este objeto (ou um `DEFAULT_BUILD_INFO` quando `buildInfo` não existir).
   - Vantagem: sem necessidade de `child_process` no runtime e comportamento previsível em serverless.

3. Página de perfil (`app/pages/profile.vue`)
   - Busca `/api/build-info` via `useAsyncData` (server: false, client only), para exibir os metadados quando o usuário (admin) solicitar.

---

## 3) Por que, na Vercel, você via "indisponível"?

Causas comuns:
- Deploy não originado pelo fluxo Git integrado (ex.: upload de artefato, arquivos zipados); nestes casos as variáveis `VERCEL_GIT_*` podem não estar definidas.
- Variáveis de ambiente automáticas desativadas/ausentes por configuração do projeto na Vercel.
- O build foi executado em um ambiente onde o Git não está disponível ou onde `.git` não foi copiado (por exemplo, ao usar artefatos exportados por CI externo).

Solução adotada: calcular `buildInfo` durante o `build` com a melhor informação disponível (variáveis de ambiente > envs manuais > git local). Em produção, a melhor prática é confiar nas variáveis que a Vercel fornece automaticamente ou definir variáveis manuais durante o deploy.

---

## 4) Variáveis sugeridas para garantir disponibilidade (recomendado)

- Variáveis automáticas (quando a Vercel integra com o repositório Git):
  - VERCEL_GIT_COMMIT_SHA
  - VERCEL_GIT_COMMIT_REF
  - VERCEL_GIT_COMMIT_MESSAGE
  - VERCEL_GIT_COMMIT_AUTHOR_LOGIN ou VERCEL_GIT_COMMIT_AUTHOR_NAME

- Variáveis manuais (fallback/compatibilidade):
  - NUXT_BUILD_COMMIT_SHA
  - NUXT_BUILD_COMMIT_MESSAGE
  - NUXT_BUILD_COMMIT_AUTHOR
  - NUXT_BUILD_COMMIT_DATE (ISO)
  - NUXT_BUILD_BRANCH
  - NUXT_BUILD_TIMESTAMP (ISO)

Recomendação: configure apenas as variáveis manuais se seu fluxo de deploy não fornece as `VERCEL_GIT_*` automáticas.

---

## 5) Instruções passo-a-passo — Vercel (UI)

1. Abra o Dashboard do projeto na Vercel.
2. Navegue até `Settings` → `Environment Variables`.
3. Adicione (se necessário) as variáveis listadas em "Variáveis sugeridas". Selecionar o ambiente adequado (Production / Preview / Development) conforme seu fluxo.
   - Exemplos:
     - Key: `NUXT_BUILD_COMMIT_SHA`  Value: `d521114...`  Environment: `Production`
     - Key: `NUXT_BUILD_TIMESTAMP` Value: `2025-11-11T16:46:00Z` Environment: `Production`
4. Salve as variáveis.
5. Faça um redeploy do projeto: vá em `Deployments` → selecione o deploy e clique `Redeploy` ou faça um novo push no Git.

Observação: se o projeto estiver integrado ao Git via Vercel, normalmente a Vercel preenche automaticamente `VERCEL_GIT_*` para builds originados por commits do repositório; então não é necessário inserir nada manualmente.

---

## 6) Instruções passo-a-passo — Vercel CLI (opcional)

1. Instale e faça login no vercel CLI (se ainda não):

```bash
npm i -g vercel
vercel login
```

2. Para adicionar uma variável de ambiente para produção via CLI:

```bash
# Exemplo: adicionar o SHA do commit (substitua <SHA> pelo valor real)
vercel env add NUXT_BUILD_COMMIT_SHA production
# o CLI irá pedir o valor; cole o SHA e confirme

# Outra forma para setar programaticamente usando vercel env pull/push (mais avançado)
```

3. Após definir as variáveis, acione um deploy no dashboard ou com `vercel --prod`.

---

## 7) Como validar que está funcionando (local e produção)

Local (após `npm run build`):

1. Rode:

```bash
npm run build
# Em seguida, preview do servidor Nitro
node .output/server/index.mjs
```

2. Abra `http://localhost:3000/api/build-info` (ou o host/porta mostrados) e confirme JSON com as chaves esperadas.

Produção (Vercel):

1. Após redeploy, abra `https://<SEU_DOMINIO>/api/build-info` — deve retornar JSON com `commitHash`, `commitShort`, `commitDate`, `commitMessage`, `commitAuthor`, `branch`, `buildTimestamp`.
2. Na página de perfil do app, abra a seção "Build Info" e clique em "Atualizar" (se disponível) para disparar a chamada que busca `/api/build-info`.

---

## 8) Exemplo de saída esperada (JSON)

```json
{
  "commitHash": "d521114...",
  "commitShort": "d521114",
  "commitDate": "2025-11-11T16:46:03Z",
  "commitMessage": "ci(build): add runtimeConfig buildInfo for production + build-info API using runtimeConfig",
  "commitAuthor": "Fernando",
  "branch": "master",
  "buildTimestamp": "2025-11-11T16:46:03.000Z"
}
```

---

## 9) Segurança e privacidade

- `commitMessage` e `commitAuthor` normalmente não contêm segredos — mas considere se deseja disponibilizá-los publicamente no cliente. No projeto já há um resumo público (`runtimeConfig.public.buildInfoPublic`) que expõe somente `commitShort` e `buildTimestamp` no cliente. Mantenha `buildInfo` completo **no runtime server**.
- Nunca poste chaves secretas ou tokens em variáveis públicas.

---

## 10) Troubleshooting

- Se mesmo com variáveis definidas você obtiver `indisponível`:
  - Verifique se o redeploy foi executado após a alteração das variáveis.
  - Confirme na página de Deploys/Logs da Vercel se as variáveis aparecem nos logs do build (procure por `VERCEL_GIT_COMMIT_SHA` etc.).
  - Se estiver usando um pipeline externo (CI) que gera artefatos, garanta que as variáveis `NUXT_BUILD_*` sejam colocadas no ambiente de build ou passadas ao agente que executa o `nuxt build`.

---

## 11) Checklist final (rápida)

- [ ] Fazer push do commit (se ainda não estiver no remoto) — no seu caso, `d521114` já está no remoto.
- [ ] Confirmar se os deploys usam o fluxo Git integrado da Vercel (recomendado).
- [ ] Se necessário, definir `NUXT_BUILD_*` no Dashboard da Vercel para builds manuais.
- [ ] Redeploy e validação via `/api/build-info`.

---

## 12) Como posso ajudar agora

- Posso: (A) executar o commit/push final (se houver mudanças locais pendentes), (B) instruir passo-a-passo no Dashboard da Vercel com exemplos reais que você quiser publicar, ou (C) executar um redeploy via Vercel CLI (você precisa me autorizar ou executar localmente). Diga qual opção prefere.

---

Documento gerado automaticamente pelo fluxo de suporte ao repositório — se desejar, adapto o texto para um README reduzido ou um checklist de deploy a ser incluído no repositório.
