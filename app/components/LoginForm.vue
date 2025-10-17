<template>
  <div class="w-full max-w-md">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text mb-2">Bem-vindo de volta</h1>
      <p class="text-text-muted">Entre com suas credenciais para acessar o sistema</p>
    </div>

    <form class="space-y-5">
      <BaseInput
        v-model="email"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        required
      >
        <template #prefix>
          <EnvelopeIcon class="w-5 h-5" />
        </template>
      </BaseInput>

      <BaseInput
        v-model="password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        required
      >
        <template #prefix>
          <LockClosedIcon class="w-5 h-5" />
        </template>
      </BaseInput>

      <div class="pt-2">
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
        >
          Entrar
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

const email = ref('')
const password = ref('')
</script>
