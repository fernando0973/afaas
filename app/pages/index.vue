<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-12">
    <!-- Header com info do usuário -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-brand mb-2">
          Dashboard AFAAS
        </h1>
        <p class="text-text-muted">
          Bem-vindo, {{ user?.email || 'Usuário' }}!
        </p>
      </div>
      
      <BaseButton variant="outline" @click="logout">
        Sair
      </BaseButton>
    </div>

    <p class="text-text-muted mb-8">
      Sistema de gerenciamento de atendimentos AFAAS.
    </p>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-surface border border-surface-muted rounded-lg p-6 shadow-card">
        <h2 class="font-semibold text-lg mb-2">Card 1</h2>
        <p class="text-text-muted text-sm">
          Exemplo de card usando tokens semânticos de cor e radius.
        </p>
      </div>

      <div class="bg-success/10 border border-success rounded-xl p-6">
        <h2 class="font-semibold text-lg mb-2 text-success">Sucesso</h2>
        <p class="text-sm">Token de cor semântica <code class="font-mono text-xs bg-black/5 px-1 rounded">success</code>.</p>
      </div>

      <div class="bg-warning/10 border border-warning rounded-xl p-6">
        <h2 class="font-semibold text-lg mb-2 text-warning">Aviso</h2>
        <p class="text-sm">Token <code class="font-mono text-xs bg-black/5 px-1 rounded">warning</code>.</p>
      </div>

      <div class="bg-danger/10 border border-danger rounded-xl p-6">
        <h2 class="font-semibold text-lg mb-2 text-danger">Perigo</h2>
        <p class="text-sm">Token <code class="font-mono text-xs bg-black/5 px-1 rounded">danger</code>.</p>
      </div>

      <div class="bg-brand text-brand-foreground rounded-xl p-6 shadow-card">
        <h2 class="font-semibold text-lg mb-2">Marca</h2>
        <p class="text-sm opacity-90">
          Usando <code class="font-mono text-xs bg-white/20 px-1 rounded">brand</code> e <code class="font-mono text-xs bg-white/20 px-1 rounded">brand-foreground</code>.
        </p>
      </div>

      <div class="bg-surface-muted rounded-lg p-6">
        <h2 class="font-semibold text-lg mb-2">Surface Muted</h2>
        <p class="text-text-muted text-sm">Fundo alternativo para seções.</p>
      </div>
    </div>

    <div class="mt-10 p-6 bg-surface rounded-xl border shadow-card">
      <h3 class="font-semibold mb-2">Tipografia</h3>
      <p class="text-text mb-2">Texto padrão usando <code class="font-mono text-xs bg-black/5 px-1 rounded">text-text</code>.</p>
      <p class="text-text-muted mb-2">Texto secundário usando <code class="font-mono text-xs bg-black/5 px-1 rounded">text-text-muted</code>.</p>
      <p class="text-text-inverted bg-black px-2 py-1 rounded inline-block">
        Texto invertido <code class="font-mono text-xs">text-text-inverted</code>.
      </p>
    </div>
  </div>
</template>
