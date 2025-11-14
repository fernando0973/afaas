# Correção do Schema de Especialidades

## Problema Identificado
O sistema estava tentando acessar campos que não existem na tabela `afaas_especialidades`:
- Campo `nome` não existe (deve ser `especialidade`)  
- Campo `ativo` não existe
- Campo `descricao` não existe

## Correções Aplicadas

### 1. Composable `useRelatorios.ts`
✅ **Corrigido**: Query da função `buscarEspecialidadesRelatorio`
- **Antes**: `select id, nome, descricao, ativo, created_at`
- **Depois**: `select id, especialidade, created_at`

### 2. Interface TypeScript - Página `relatorios-especialidades.vue`
✅ **Corrigido**: Tipos da interface `EspecialidadeComStats`
- **Removido**: campos `nome`, `ativo`, `descricao`
- **Adicionado**: campo `especialidade: string`

### 3. Componente `TabelaEspecialidadesRelatorio.vue`
✅ **Corrigido**: Coluna do nome da especialidade
- **Antes**: `{{ especialidade.nome }}`
- **Depois**: `{{ especialidade.especialidade }}`

✅ **Removido**: Coluna de status (inexistente no banco)
- Removida toda lógica relacionada ao campo `ativo`

### 4. Modal de Detalhes - Página `relatorios-especialidades.vue`
✅ **Corrigido**: Título do modal
- **Antes**: `especialidadeDetalhes?.nome`
- **Depois**: `especialidadeDetalhes?.especialidade`

✅ **Removido**: Seção de status e descrição
- Removidos elementos relacionados aos campos inexistentes

## Schema Real da Tabela
```sql
afaas_especialidades:
- id: integer (primary key)
- especialidade: string (nome da especialidade)
- created_at: timestamp
```

## Status
✅ **CONCLUÍDO** - Todas as correções aplicadas com sucesso
✅ **VERIFICADO** - TypeScript check passou sem erros relacionados às especialidades
✅ **FUNCIONANDO** - Sistema está alinhado com o schema real da base de dados

## Resultado
Os erros de console "400 Bad Request" e "column does not exist" foram resolvidos. O sistema agora acessa corretamente apenas os campos que existem na tabela `afaas_especialidades`.