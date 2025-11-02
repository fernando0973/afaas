# AFAAS - Sistema de Atendimentos

Sistema de cadastro de clientes e gerenciamento de atendimentos da AFAAS (Associação de Fisioterapeutas e Terapeutas Alternativos).

## Tecnologias

- **Nuxt 4** - Framework Vue.js full-stack
- **Supabase** - Backend-as-a-Service com autenticação
- **Tailwind CSS** - Framework de estilos
- **TypeScript** - Tipagem estática
- **Vue 3** - Framework reativo

## Setup

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Adicione suas credenciais do Supabase no arquivo `.env`.

## Desenvolvimento

Inicie o servidor de desenvolvimento em `http://localhost:3000`:

```bash
npm run dev
```

## Produção

Build da aplicação para produção:

```bash
npm run build
```

Visualizar o build localmente:

```bash
npm run preview
```

## Funcionalidades

### 🔐 Autenticação e Segurança
- ✅ Sistema completo de autenticação com Supabase
- ✅ Proteção de rotas com middlewares
- ✅ Gerenciamento de sessões e perfis de usuário

### 🎨 Interface e Experiência do Usuário
- ✅ Design system personalizado com Tailwind CSS
- ✅ Componentes base reutilizáveis (Botões, Inputs, Modais, Tabelas)
- ✅ Interface responsiva e acessível
- ✅ Sistema de notificações toast
- ✅ Layouts adaptativos para diferentes contextos

### 👥 Gestão de Profissionais
- ✅ CRUD completo de profissionais/atendentes
- ✅ Validações de dados e campos obrigatórios
- ✅ Sistema de confirmação para exclusões
- ✅ Dashboard personalizado por usuário

### 👤 Gestão de Clientes
- ✅ CRUD completo de clientes com formulário abrangente
- ✅ Validação de CPF e dados pessoais
- ✅ Sistema de reativação para clientes removidos
- ✅ Formulário com 5 abas: Dados Pessoais, Endereço, Família & Ambiente, Histórico Médico, Hábitos & Condições
- ✅ Máscaras de entrada para CPF, telefone e CEP
- ✅ Validações avançadas e feedback visual

### 📅 Sistema de Agendamentos
- ✅ Calendário visual profissional com grid de horários
- ✅ Visualização semanal de agendamentos
- ✅ Navegação entre semanas
- ✅ **Seletor de cores personalizado para agendamentos**
  - 12 cores predefinidas incluindo `#71E3AD` e `#72C1EE`
  - Campo para entrada de cor personalizada (hex)
  - Seleção visual interativa no modal
- ✅ Modal de criação de agendamentos com validação
- ✅ Posicionamento preciso baseado em horários (8:00-22:00)
- ✅ Interface otimizada para tela cheia
- ✅ Footer com identificação do sistema

### 🏗️ Arquitetura e Qualidade
- ✅ Estrutura modular com componentes especializados
- ✅ TypeScript em 100% do código
- ✅ Composables para lógica de negócio
- ✅ Estados reativos com Pinia
- ✅ Padrões de nomenclatura consistentes
- ✅ Build otimizado para produção

Consulte a [documentação do Nuxt](https://nuxt.com/docs/getting-started/introduction) para mais informações.
