# 🔧 Como Resolver o Problema do Login

## 📋 Problema Identificado
As chaves de API do Supabase no arquivo `.env` estão incorretas ou inválidas.

## 🔑 Como Obter as Chaves Corretas

### 1. Acesse o Dashboard do Supabase
- Vá para: https://supabase.com/dashboard
- Faça login com sua conta

### 2. Selecione seu Projeto
- Clique no projeto `fnknrlvbquwtrukreqey`

### 3. Obtenha as Chaves de API
- No painel lateral, vá em **Settings** → **API**
- Você verá duas seções importantes:

#### Project URL
```
https://fnknrlvbquwtrukreqey.supabase.co
```

#### API Keys
- **anon/public**: Esta é sua `SUPABASE_ANON_KEY`
- **service_role**: Esta é sua `SUPABASE_SERVICE_KEY` (opcional)

### 4. Atualize o arquivo .env

Substitua o conteúdo do arquivo `.env` por:

```env
SUPABASE_URL=https://fnknrlvbquwtrukreqey.supabase.co
SUPABASE_ANON_KEY=[COLE AQUI A CHAVE ANON/PUBLIC]
SUPABASE_SERVICE_KEY=[COLE AQUI A CHAVE SERVICE_ROLE]
```

## ⚡ Verificações Adicionais

### 1. Configurações de Autenticação
No Dashboard do Supabase, vá para:
- **Authentication** → **Settings**
- Verifique se **Email** está habilitado em **Auth Providers**

### 2. Usuários de Teste
- Vá para **Authentication** → **Users**
- Crie um usuário de teste se necessário
- Ou verifique se existe um usuário com o e-mail que está tentando usar

### 3. Configurações de E-mail
- Se estiver em desenvolvimento, pode precisar confirmar manualmente os usuários
- Ou configurar um provedor de e-mail para confirmação automática

## 🧪 Teste Após Corrigir

Após atualizar as chaves, teste:

```bash
npm run dev
```

Tente fazer login e veja se o erro persiste.

## 📞 Se Ainda Tiver Problemas

1. Verifique se o projeto Supabase está ativo
2. Confirme se as chaves foram copiadas corretamente (sem espaços extras)
3. Teste se consegue acessar o banco de dados através da interface do Supabase

---

**Nota**: As chaves que coloquei no arquivo são exemplos genéricos. Você DEVE usar as chaves específicas do seu projeto Supabase para que funcione corretamente.