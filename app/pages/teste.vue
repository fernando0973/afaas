<template>
  <div class="mx-auto max-w-5xl px-6 py-12">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-text mb-2">Componentes Base</h1>
      <p class="text-text-muted">Testando BaseButton, BaseInput, Ícones e Toasts com o design system AFAAS</p>
    </div>

    <!-- Toast Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">Toast Notifications</h2>
      
      <div class="flex flex-wrap gap-3">
        <BaseButton variant="primary" @click="showSuccessToast">
          <template #iconLeft>
            <CheckCircleIcon class="w-5 h-5" />
          </template>
          Toast Sucesso
        </BaseButton>
        
        <BaseButton variant="danger" @click="showErrorToast">
          <template #iconLeft>
            <XCircleIcon class="w-5 h-5" />
          </template>
          Toast Erro
        </BaseButton>
        
        <BaseButton variant="secondary" @click="showWarningToast">
          <template #iconLeft>
            <ExclamationTriangleIcon class="w-5 h-5" />
          </template>
          Toast Aviso
        </BaseButton>
        
        <BaseButton variant="outline" @click="showInfoToast">
          <template #iconLeft>
            <InformationCircleIcon class="w-5 h-5" />
          </template>
          Toast Info
        </BaseButton>
      </div>
    </section>

    <!-- BaseButton -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">BaseButton</h2>

      <div class="space-y-8">
        <!-- Variantes -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Variantes</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="outline">Outline</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
          </div>
        </div>

        <!-- Com Ícones -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Com Ícones</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary">
              <template #iconLeft>
                <PlusIcon class="w-5 h-5" />
              </template>
              Adicionar
            </BaseButton>
            
            <BaseButton variant="secondary">
              <template #iconLeft>
                <PencilIcon class="w-5 h-5" />
              </template>
              Editar
            </BaseButton>
            
            <BaseButton variant="danger">
              <template #iconLeft>
                <TrashIcon class="w-5 h-5" />
              </template>
              Excluir
            </BaseButton>
            
            <BaseButton variant="outline">
              Salvar
              <template #iconRight>
                <ArrowDownTrayIcon class="w-5 h-5" />
              </template>
            </BaseButton>
            
            <BaseButton variant="ghost">
              <template #iconLeft>
                <MagnifyingGlassIcon class="w-5 h-5" />
              </template>
              Buscar
            </BaseButton>
          </div>
        </div>

        <!-- Tamanhos -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Tamanhos</h3>
          <div class="flex flex-wrap items-center gap-3">
            <BaseButton size="sm">
              <template #iconLeft>
                <SparklesIcon class="w-4 h-4" />
              </template>
              Pequeno
            </BaseButton>
            <BaseButton size="md">
              <template #iconLeft>
                <SparklesIcon class="w-5 h-5" />
              </template>
              Médio
            </BaseButton>
            <BaseButton size="lg">
              <template #iconLeft>
                <SparklesIcon class="w-6 h-6" />
              </template>
              Grande
            </BaseButton>
          </div>
        </div>

        <!-- Estados -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Estados</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton>
              <template #iconLeft>
                <CheckIcon class="w-5 h-5" />
              </template>
              Normal
            </BaseButton>
            <BaseButton disabled>
              <template #iconLeft>
                <XMarkIcon class="w-5 h-5" />
              </template>
              Desabilitado
            </BaseButton>
            <BaseButton loading>Carregando</BaseButton>
          </div>
        </div>

        <!-- Full Width -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Largura Total</h3>
          <BaseButton full-width>
            <template #iconLeft>
              <ArrowRightIcon class="w-5 h-5" />
            </template>
            Botão Full Width
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- BaseInput -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">BaseInput</h2>

      <div class="space-y-6 max-w-2xl">
        <!-- Input básico -->
        <BaseInput
          v-model="form.name"
          label="Nome completo"
          placeholder="Digite seu nome"
          hint="Como você gostaria de ser chamado"
        />

        <!-- Input obrigatório -->
        <BaseInput
          v-model="form.email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          required
        />

        <!-- Input com erro -->
        <BaseInput
          v-model="form.password"
          type="password"
          label="Senha"
          placeholder="********"
          :error="form.password.length > 0 && form.password.length < 6 ? 'Senha deve ter no mínimo 6 caracteres' : ''"
        />

        <!-- Input desabilitado -->
        <BaseInput
          model-value="Campo desabilitado"
          label="Campo desabilitado"
          disabled
        />

        <!-- Input readonly -->
        <BaseInput
          model-value="Campo somente leitura"
          label="Somente leitura"
          readonly
        />

        <!-- Input de telefone -->
        <BaseInput
          v-model="form.phone"
          type="tel"
          label="Telefone"
          placeholder="(00) 00000-0000"
          hint="DDD + número"
        />

        <!-- Input de data -->
        <BaseInput
          v-model="form.date"
          type="date"
          label="Data de nascimento"
        />
      </div>
    </section>

    <!-- Formulário de exemplo -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">Formulário de Exemplo</h2>
      
      <div class="max-w-2xl bg-surface border border-border rounded-xl p-6 shadow-card">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <BaseInput
            v-model="contactForm.name"
            label="Nome"
            placeholder="Seu nome"
            required
          />

          <BaseInput
            v-model="contactForm.email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            required
          />

          <BaseInput
            v-model="contactForm.message"
            label="Mensagem"
            placeholder="Digite sua mensagem"
            hint="Mínimo 10 caracteres"
          />

          <div class="flex gap-3 pt-2">
            <BaseButton type="submit" variant="primary">
              Enviar
            </BaseButton>
            <BaseButton type="button" variant="outline" @click="resetContactForm">
              Limpar
            </BaseButton>
          </div>
        </form>
      </div>
    </section>

    <!-- Paleta de cores -->
    <section>
      <h2 class="text-2xl font-semibold text-text mb-6">Paleta de Cores</h2>
      
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-primary-500 text-white rounded-lg p-4">
          <p class="font-medium">Primary</p>
          <p class="text-sm opacity-90">#3a9d6d</p>
        </div>
        <div class="bg-secondary-500 text-white rounded-lg p-4">
          <p class="font-medium">Secondary</p>
          <p class="text-sm opacity-90">#a88968</p>
        </div>
        <div class="bg-neutral-500 text-white rounded-lg p-4">
          <p class="font-medium">Neutral</p>
          <p class="text-sm opacity-90">#8a9790</p>
        </div>
        <div class="bg-success text-white rounded-lg p-4">
          <p class="font-medium">Success</p>
          <p class="text-sm opacity-90">#3a9d6d</p>
        </div>
        <div class="bg-warning text-white rounded-lg p-4">
          <p class="font-medium">Warning</p>
          <p class="text-sm opacity-90">#d97706</p>
        </div>
        <div class="bg-danger text-white rounded-lg p-4">
          <p class="font-medium">Danger</p>
          <p class="text-sm opacity-90">#dc2626</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const toast = useToast()

const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  date: ''
})

const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

// Toast functions
const showSuccessToast = () => {
  toast.success('Operação realizada com sucesso!', {
    timeout: 3000
  })
}

const showErrorToast = () => {
  toast.error('Erro ao processar a operação!', {
    timeout: 3000
  })
}

const showWarningToast = () => {
  toast.warning('Atenção! Verifique os dados informados.', {
    timeout: 3000
  })
}

const showInfoToast = () => {
  toast.info('Informação importante sobre o sistema.', {
    timeout: 3000
  })
}

const handleSubmit = () => {
  toast.success('Formulário enviado com sucesso!')
  console.log('Formulário enviado:', contactForm.value)
}

const resetContactForm = () => {
  contactForm.value = {
    name: '',
    email: '',
    message: ''
  }
  toast.info('Formulário limpo')
}
</script>
