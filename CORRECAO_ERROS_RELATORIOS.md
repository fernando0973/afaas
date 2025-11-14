# Correção de Erros nas Páginas de Relatórios

## Problemas Identificados e Corrigidos

### 1. **relatorios-plantas.vue - Tipo incompatível de ID**
**Problema**: Interface `PlantaRelatorio` no componente `TabelaPlantasRelatorio.vue` declarava `id` como `string`, mas o banco retorna `number`.

**Correção**: 
```typescript
// Antes
interface PlantaRelatorio {
  id: string  // ❌ Tipo incorreto
  // ...
}

// Depois  
interface PlantaRelatorio {
  id: number  // ✅ Tipo correto
  nome_popular: string
  nome_cientifico?: string | null
  partes_usadas?: string[] | null
  indicacoes?: string | null
  acao_terapeutica?: string | null
  created_at: string | null
  renisus?: boolean | null
}
```

### 2. **relatorios-clientes.vue - Parâmetros de função incompatíveis**
**Problema**: Funções `formatarDataCurta` e `formatarUltimoAtendimento` não aceitavam `undefined`, mas a interface `FormatFn` esperava.

**Correção**:
```typescript
// Antes
const formatarDataCurta = (data: string | null) => { // ❌ Faltava undefined
const formatarUltimoAtendimento = (data: string | null) => { // ❌ Faltava undefined

// Depois
const formatarDataCurta = (data: string | null | undefined) => { // ✅ Tipos corretos
const formatarUltimoAtendimento = (data: string | null | undefined) => { // ✅ Tipos corretos
```

### 3. **relatorios-plantas.vue - Tipo derivado problemático**
**Problema**: Tipo `PlantaRelatorio` estava sendo inferido automaticamente, causando incompatibilidades.

**Correção**:
```typescript
// Antes
type PlantaRelatorio = Awaited<ReturnType<typeof buscarPlantasRelatorio>>[number] // ❌ Inferência problemática

// Depois
type PlantaRelatorio = {  // ✅ Tipo explícito e completo
  id: number
  nome_popular: string
  nome_cientifico?: string | null
  partes_usadas?: string[] | null
  indicacoes?: string | null
  acao_terapeutica?: string | null
  created_at: string | null
  renisus?: boolean | null
  deleted_at?: string | null
  sabor_propriedade?: string[] | null
  meridianos?: string[] | null
  contraindicacoes?: string | null
}
```

### 4. **TabelaPlantasRelatorio.vue - Definição de evento**
**Correção**: Padronizada definição de evento para consistência:
```typescript
// Antes
defineEmits<{
  abrirDetalhes: [planta: PlantaRelatorio]  // ❌ Sintaxe tuple
}>()

// Depois
defineEmits<{
  (event: 'abrirDetalhes', planta: PlantaRelatorio): void  // ✅ Sintaxe padrão
}>()
```

## Status Final
✅ **relatorios-clientes.vue**: Todos os erros corrigidos
✅ **relatorios-plantas.vue**: Todos os erros corrigidos  
✅ **TabelaPlantasRelatorio.vue**: Interface e tipos corrigidos
✅ **RelatorioClientesTabela.vue**: Tipos validados

## Erros Restantes (Não relacionados aos relatórios)
- `EditarUsuarioModal.vue`: Problemas com API response
- `useAgendamentoForm.ts`: Incompatibilidade de tipos Supabase

Os relatórios de clientes e plantas agora estão funcionando sem erros de TypeScript!