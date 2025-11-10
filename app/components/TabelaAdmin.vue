<template>
  <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <!-- Cabeçalho da tabela -->
    <div class="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-neutral-900">Usuários do Sistema</h3>
          <p class="text-sm text-neutral-600 mt-1">
            {{ usuarios.length }} {{ usuarios.length === 1 ? 'usuário encontrado' : 'usuários encontrados' }}
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton 
            variant="primary"
            size="sm"
            @click="abrirModalNovoUsuario"
          >
            <template #iconLeft>
              <UserIcon class="w-4 h-4" />
            </template>
            Adicionar Usuário
          </BaseButton>
          
          <BaseButton 
            variant="outline"
            size="sm"
            :disabled="carregando"
            @click="recarregarDados"
          >
            <template #iconLeft>
              <ArrowPathIcon :class="['w-4 h-4', carregando ? 'animate-spin' : '']" />
            </template>
            Atualizar
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Estado de carregamento -->
    <div v-if="carregando" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ArrowPathIcon class="w-8 h-8 text-neutral-400 animate-spin mb-3" />
        <p class="text-neutral-600">Carregando usuários...</p>
      </div>
    </div>

    <!-- Estado de erro -->
    <div v-else-if="erro" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ExclamationTriangleIcon class="w-8 h-8 text-red-400 mb-3" />
        <p class="text-red-600 mb-2">Erro ao carregar usuários</p>
        <p class="text-sm text-neutral-600 mb-4">{{ erro }}</p>
        <BaseButton 
          variant="primary"
          @click="recarregarDados"
        >
          <template #iconLeft>
            <ArrowPathIcon class="w-4 h-4" />
          </template>
          Tentar Novamente
        </BaseButton>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="usuarios.length === 0" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <UsersIcon class="w-12 h-12 text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Nenhum usuário encontrado</h3>
        <p class="text-neutral-600 mb-4">Não foi possível encontrar usuários no sistema.</p>
      </div>
    </div>

    <!-- Tabela de dados -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Usuário
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              E-mail
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Criado em
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr 
            v-for="usuario in usuarios" 
            :key="usuario.id"
            class="hover:bg-neutral-50 transition-colors"
          >

            <!-- Nome -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div 
                    :class="[
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      getRoleConfig(usuario.role || '').colors.bg
                    ]"
                  >
                    <UserIcon class="h-4 w-4 text-current opacity-70" />
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-neutral-900">
                    {{ usuario.nome }}
                  </div>
                </div>
              </div>
            </td>

            <!-- E-mail -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              {{ usuario.email }}
            </td>

            <!-- Role -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  getRoleConfig(usuario.role || '').colors.bg,
                  getRoleConfig(usuario.role || '').colors.text
                ]"
              >
                {{ getRoleConfig(usuario.role || '').label }}
              </span>
            </td>

            <!-- Data de criação -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              {{ formatarData(usuario.created_at) }}
            </td>

            <!-- Ações -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <BaseButton 
                  variant="ghost"
                  size="sm"
                  @click="visualizarUsuario(usuario)"
                  title="Ver detalhes do usuário"
                >
                  <EyeIcon class="w-4 h-4" />
                </BaseButton>
                
                <BaseButton 
                  variant="ghost"
                  size="sm"
                  @click="editarUsuario(usuario)"
                  title="Editar usuário"
                  class="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <PencilIcon class="w-4 h-4" />
                </BaseButton>
                
                <BaseButton 
                  variant="ghost"
                  size="sm"
                  @click="confirmarExclusaoUsuario(usuario)"
                  :disabled="!!(user && (usuario.user_id === user.id || usuario.email === user.email))"
                  :title="user && (usuario.user_id === user.id || usuario.email === user.email)
                    ? 'Você não pode deletar sua própria conta' 
                    : 'Excluir usuário'"
                  :class="[
                    user && (usuario.user_id === user.id || usuario.email === user.email)
                      ? 'text-neutral-400 cursor-not-allowed' 
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  ]"
                >
                  <TrashIcon class="w-4 h-4" />
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal para criar novo usuário -->
  <NovoUsuarioModal
    v-model="modalNovoUsuarioAberto"
    @usuario-criado="recarregarDados"
  />

  <!-- Modal para editar usuário -->
  <EditarUsuarioModal
    :is-open="modalEditarUsuarioAberto"
    :usuario="usuarioParaEditar"
    @close="fecharModalEdicao"
    @usuario-atualizado="recarregarDados"
  />

  <!-- Modal de confirmação para exclusão -->
  <BaseConfirmModal
    v-model="modalConfirmacaoAberto"
    type="danger"
    title="Excluir Usuário"
    :message="`Tem certeza que deseja excluir o usuário '${usuarioParaDeletar?.nome}'? Esta ação não pode ser desfeita e removerá permanentemente o usuário do sistema.`"
    confirm-text="Excluir"
    cancel-text="Cancelar"
    :loading="deletandoUsuario"
    @confirm="executarExclusaoUsuario"
    @cancel="cancelarExclusao"
    @close="cancelarExclusao"
  />
</template>

<script setup lang="ts">
import { ArrowPathIcon, ExclamationTriangleIcon, UsersIcon, UserIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useToastNotification as useToast, POSITION } from '~/composables/useToastNotification'
import type { PerfilRPC } from '~/types/database.types'
import type { UserRole } from '~/types/user'
import { ROLE_LABELS, ROLE_COLORS } from '~/types/user'

// Composables
const { buscarPerfis } = useProfissionais()
const { deletarUsuario, user } = useAuth()
const toast = useToast()

// Estados reativos
const usuarios = ref<PerfilRPC[]>([])
const carregando = ref(false)
const erro = ref('')
const modalNovoUsuarioAberto = ref(false)

// Estados do modal de confirmação de exclusão
const modalConfirmacaoAberto = ref(false)
const usuarioParaDeletar = ref<PerfilRPC | null>(null)
const deletandoUsuario = ref(false)

// Estados do modal de edição
const modalEditarUsuarioAberto = ref(false)
const usuarioParaEditar = ref<PerfilRPC | null>(null)

// Função para carregar dados
const carregarDados = async () => {
  carregando.value = true
  erro.value = ''
  
  try {
    const resultado = await buscarPerfis()
    
    if (resultado.success) {
      usuarios.value = resultado.data
    } else {
      erro.value = resultado.error || 'Erro desconhecido ao carregar usuários'
    }
  } catch (error: any) {
    erro.value = error.message || 'Erro inesperado ao carregar usuários'
  } finally {
    carregando.value = false
  }
}

// Função para recarregar dados
const recarregarDados = async () => {
  await carregarDados()
}

// Função para formatar data
// Função para formatar data
const formatarData = (dataISO: string): string => {
  const data = new Date(dataISO)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  })
}

// Função para obter configuração visual do role
const getRoleConfig = (role: string) => {
  const roleType = role as UserRole
  return {
    label: ROLE_LABELS[roleType] || role,
    colors: ROLE_COLORS[roleType] || { bg: 'bg-gray-100', text: 'text-gray-800' }
  }
}

// Função para abrir modal de novo usuário
const abrirModalNovoUsuario = () => {
  modalNovoUsuarioAberto.value = true
}

// Função para visualizar usuário (placeholder)
const visualizarUsuario = (usuario: PerfilRPC) => {
  // TODO: Implementar modal ou navegação para detalhes do usuário
}

// Função para confirmar exclusão do usuário
const confirmarExclusaoUsuario = (usuario: PerfilRPC) => {
  // Verificar se o usuário está tentando deletar a própria conta
  // Comparar tanto por user_id quanto por email para maior segurança
  const isOwnAccount = user.value && (
    usuario.user_id === user.value.id || 
    usuario.email === user.value.email
  )

  if (isOwnAccount) {
    toast.error('Você não pode deletar sua própria conta do sistema')
    return
  }

  // Se não for o próprio usuário, mostrar modal de confirmação
  usuarioParaDeletar.value = usuario
  modalConfirmacaoAberto.value = true
}

// Função para executar a exclusão do usuário
const executarExclusaoUsuario = async () => {
  if (!usuarioParaDeletar.value?.user_id) {
    toast.error('Erro: ID do usuário não encontrado')
    return
  }

  deletandoUsuario.value = true
  
  try {
    const resultado = await deletarUsuario(usuarioParaDeletar.value.user_id)
    
    if (resultado.success) {
      toast.success(resultado.message)
      
      // Fechar modal e limpar estado
      modalConfirmacaoAberto.value = false
      usuarioParaDeletar.value = null
      
      // Recarregar lista de usuários
      await recarregarDados()
    } else {
      toast.error(resultado.message)
    }
  } catch (error: any) {
    toast.error('Erro inesperado ao deletar usuário')
  } finally {
    deletandoUsuario.value = false
  }
}

// Função para cancelar exclusão
const cancelarExclusao = () => {
  modalConfirmacaoAberto.value = false
  usuarioParaDeletar.value = null
}

// Função para abrir modal de edição
const editarUsuario = (usuario: PerfilRPC) => {
  usuarioParaEditar.value = usuario
  modalEditarUsuarioAberto.value = true
}

// Função para fechar modal de edição
const fecharModalEdicao = () => {
  modalEditarUsuarioAberto.value = false
  usuarioParaEditar.value = null
}

// Aguardar middleware e verificação de admin antes de carregar dados
onMounted(() => {
  // Aguarda múltiplos nextTick para garantir que:
  // 1. O middleware foi executado
  // 2. A verificação de admin foi concluída
  // 3. O componente está totalmente montado
  setTimeout(() => {
    carregarDados()
  }, 100) // Pequeno delay para garantir que tudo foi inicializado
})

// Exposer função para uso externo
defineExpose({
  recarregarDados
})
</script>