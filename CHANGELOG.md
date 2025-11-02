# Changelog - AFAAS Atendimento

## [1.4.0] - 2025-11-01

### ✨ **Nova Funcionalidade: Seletor de Cores para Agendamentos**

#### 🎨 **Seletor de Cores Implementado**
- **12 cores predefinidas** em layout de grid visual
- **Cores especiais incluídas**: `#71E3AD` (verde claro) e `#72C1EE` (azul claro)
- **Campo para cor personalizada** via input hexadecimal
- **Seleção visual interativa** com destaque da cor escolhida
- **Valor padrão** mantido como `#DBE9FE` (cor original do banco)

#### 🔧 **Melhorias Técnicas**
- **Correção de comentários JSDoc** mal fechados em `useAgendamentos.ts`
- **Remoção completa** de código de debug e arquivos de teste
- **Limpeza de cache** do Nuxt para resolver problemas de importação
- **Integração completa** com formulário reativo do modal

#### 🏗️ **Arquivos Modificados**
- `NovoAgendamentoModal.vue` - Implementação do seletor de cores
- `useAgendamentos.ts` - Correção de sintaxe dos comentários
- `AgendamentoManager.vue` - Limpeza de debug e melhorias
- Múltiplos componentes - Remoção de código de teste

#### 🚀 **Como Usar**
1. Acesse a página de agendamentos
2. Clique no botão **"+ Novo"**
3. No modal, selecione uma cor do grid ou insira uma personalizada
4. Complete o formulário e crie o agendamento
5. A cor escolhida será aplicada ao slot do agendamento

---

## [1.3.0] - 2025-10-XX

### 🔐 **Sistema de Recuperação de Senha**
- Implementação completa de recuperação de senha via email
- Interface responsiva e intuitiva
- Integração com Supabase Auth

### 📅 **Sistema de Agendamentos**
- Grid visual completo para visualização de agendamentos
- Interface responsiva com navegação por semanas
- Componentes modulares e reutilizáveis

---

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## Stack Tecnológica
- **Framework**: Nuxt 4.1.3
- **UI**: Vue 3 + TypeScript + Tailwind CSS
- **Backend**: Supabase
- **Estado**: Pinia
- **Build**: Vite 7.1.10

## Status do Projeto
✅ **Build Status**: Passing  
✅ **Tests**: All components functional  
✅ **Deploy**: Ready for production