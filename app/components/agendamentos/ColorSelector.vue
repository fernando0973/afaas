<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-neutral-700">
      Cor do Agendamento
    </label>
    <div class="grid grid-cols-6 gap-2">
      <button
        v-for="cor in coresPredefinidas"
        :key="cor.valor"
        @click="$emit('update:modelValue', cor.valor)"
        :title="cor.nome"
        class="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
        :class="{
          'border-neutral-800 ring-2 ring-primary-500': modelValue === cor.valor,
          'border-neutral-300': modelValue !== cor.valor
        }"
        :style="{ backgroundColor: cor.valor }"
      />
    </div>
    <p class="text-xs text-neutral-500">
      Cor selecionada: <span class="font-mono uppercase">{{ modelValue }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: string]
}>()

// Cores predefinidas para seleção
const coresPredefinidas = [
  { nome: 'Azul Claro (Padrão)', valor: '#DBE9FE' },
  { nome: 'Verde Água', valor: '#71E3AD' },
  { nome: 'Azul Céu', valor: '#72C1EE' },
  { nome: 'Lavanda', valor: '#E3D5FF' },
  { nome: 'Rosa Claro', valor: '#FFD5E3' },
  { nome: 'Amarelo Pastel', valor: '#FFF3C7' },
  { nome: 'Salmão', valor: '#FFB5A0' },
  { nome: 'Verde Menta', valor: '#B5F0D1' },
  { nome: 'Lilás', valor: '#E5C9FF' },
  { nome: 'Pêssego', valor: '#FFD6B8' },
  { nome: 'Azul Bebê', valor: '#B8E3FF' },
  { nome: 'Verde Lima', valor: '#D4FF8C' }
]
</script>