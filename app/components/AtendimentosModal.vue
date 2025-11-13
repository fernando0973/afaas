<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdicao ? 'Editar Atendimento' : 'Novo Atendimento'"
    size="xl"
    @close="handleClose"
  >
    <!-- Abas de navegação -->
    <div class="border-b border-neutral-200 mb-6">
      <nav class="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
        <button
          v-for="aba in abas"
          :key="aba.id"
          type="button"
          @click="abaAtiva = aba.id"
          :class="[
            abaAtiva === aba.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
            'whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ aba.label }}
        </button>
      </nav>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto px-1">
      <!-- ABA 1: Dados Básicos -->
      <div v-show="abaAtiva === 'basicos'" class="space-y-4">
        <!-- Cliente -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Cliente <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.cliente_id"
            required
            :disabled="carregando"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
          >
                      <option :value="null" disabled>Selecione um cliente</option>
          <option
            v-for="cliente in clientes"
            :key="cliente.id"
            :value="cliente.id"
          >
            {{ cliente.nome_completo }} - {{ formatarCPF(cliente.cpf) }}
          </option>
          </select>
        </div>

        <!-- Profissional -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Profissional <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.profissional_id"
            required
            :disabled="carregando"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
          >
                      <option :value="null" disabled>Selecione um profissional</option>
          <option
            v-for="profissional in profissionais"
            :key="profissional.profissional_id"
            :value="profissional.profissional_id"
          >
            {{ profissional.nome_profissional }} - {{ profissional.especialidade }}
          </option>
          </select>
        </div>

        <!-- Divino Auxiliar e Pode Auxiliar -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
            <input
              id="eh_divino_auxiliar"
              v-model="form.eh_divino_auxiliar"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="eh_divino_auxiliar" class="text-sm font-medium text-neutral-700 cursor-pointer">
              É Divino Auxiliar
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
            <input
              id="pode_auxiliar"
              v-model="form.pode_auxiliar"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="pode_auxiliar" class="text-sm font-medium text-neutral-700 cursor-pointer">
              Pode Auxiliar
            </label>
          </div>
        </div>
      </div>

      <!-- ABA 2: Sinais Vitais -->
      <div v-show="abaAtiva === 'vitais'" class="space-y-4">
        <!-- Pressão Arterial -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Pressão Sistólica (mmHg)
            </label>
            <input
              v-model.number="form.pressao_sistolica"
              type="number"
              min="0"
              max="300"
              placeholder="Ex: 120"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Pressão Diastólica (mmHg)
            </label>
            <input
              v-model.number="form.pressao_diastolica"
              type="number"
              min="0"
              max="200"
              placeholder="Ex: 80"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Batimento Cardíaco -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Batimento Cardíaco (bpm)
          </label>
          <input
            v-model.number="form.batimento_cardiaco"
            type="number"
            min="0"
            max="300"
            placeholder="Ex: 72"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Status Cardíaco -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Status Cardíaco
          </label>
          <select
            v-model="form.status_cardiaco"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Selecione...</option>
            <option value="normal">Normal</option>
            <option value="alterado">Alterado</option>
            <option value="critico">Crítico</option>
          </select>
        </div>

        <!-- Energia Vital -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Energia Vital (0-100)
          </label>
          <input
            v-model.number="form.energia_vital"
            type="number"
            min="0"
            max="100"
            placeholder="Ex: 75"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div v-if="form.energia_vital !== null" class="mt-2">
            <div class="w-full bg-neutral-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="getEnergiaVitalColor(form.energia_vital)"
                :style="{ width: `${form.energia_vital}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Imunidade -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Imunidade
          </label>
          <select
            v-model="form.imunidade"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Selecione...</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        <!-- Meridiano -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Meridiano
          </label>
          <select
            v-model="form.meridiano"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Selecione...</option>
            <option value="pulmao">Pulmão</option>
            <option value="intestino_grosso">Intestino Grosso</option>
            <option value="estomago">Estômago</option>
            <option value="baco_pancreas">Baço/Pâncreas</option>
            <option value="coracao">Coração</option>
            <option value="intestino_delgado">Intestino Delgado</option>
            <option value="bexiga">Bexiga</option>
            <option value="rim">Rim</option>
            <option value="circulacao_sexo">Circulação/Sexo</option>
            <option value="triplo_aquecedor">Triplo Aquecedor</option>
            <option value="vesicula_biliar">Vesícula Biliar</option>
            <option value="figado">Fígado</option>
          </select>
        </div>
      </div>

      <!-- ABA 3: Centros Energéticos -->
      <div v-show="abaAtiva === 'centros'" class="space-y-4">
        <p class="text-sm text-neutral-600 mb-4">
          Marque os centros energéticos que apresentam desequilíbrio
        </p>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="centro_coronario"
              v-model="form.centro_coronario"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="centro_coronario" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Centro Coronário
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="centro_frontal"
              v-model="form.centro_frontal"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="centro_frontal" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Centro Frontal
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="centro_laringeo"
              v-model="form.centro_laringeo"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="centro_laringeo" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Centro Laríngeo
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="centro_cardiaco"
              v-model="form.centro_cardiaco"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="centro_cardiaco" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Centro Cardíaco
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="centro_plexo_solar"
              v-model="form.centro_plexo_solar"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="centro_plexo_solar" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Centro Plexo Solar
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="centro_umbilical"
              v-model="form.centro_umbilical"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="centro_umbilical" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Centro Umbilical
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="centro_base"
              v-model="form.centro_base"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="centro_base" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Centro Base
            </label>
          </div>
        </div>
      </div>

      <!-- ABA 4: Cadernos -->
      <div v-show="abaAtiva === 'cadernos'" class="space-y-4">
        <p class="text-sm text-neutral-600 mb-4">
          Marque os cadernos utilizados no atendimento
        </p>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_virus"
              v-model="form.caderno_virus"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_virus" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Vírus
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_bacteria"
              v-model="form.caderno_bacteria"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_bacteria" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Bactérias
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_fungos"
              v-model="form.caderno_fungos"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_fungos" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Fungos
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_parasitas"
              v-model="form.caderno_parasitas"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_parasitas" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Parasitas
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_micoplasma"
              v-model="form.caderno_micoplasma"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_micoplasma" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Micoplasma
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_bacilos"
              v-model="form.caderno_bacilos"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_bacilos" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Bacilos
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_artrites"
              v-model="form.caderno_artrites"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_artrites" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Artrites
            </label>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <input
              id="caderno_doencas"
              v-model="form.caderno_doencas"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="caderno_doencas" class="text-sm font-medium text-neutral-700 cursor-pointer flex-1">
              Caderno de Doenças
            </label>
          </div>
        </div>

        <!-- Causas e Desalinhamentos -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Causas de Desalinhamentos
          </label>
          <textarea
            v-model="form.causas_desalinhamentos"
            rows="3"
            placeholder="Descreva as causas identificadas..."
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <!-- Modificados / Outros -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Modificados / Outros
          </label>
          <textarea
            v-model="form.modificados_outros"
            rows="3"
            placeholder="Informações adicionais..."
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <!-- ABA 5: Encaminhamentos -->
      <div v-show="abaAtiva === 'encaminhamentos'" class="space-y-4">
        <!-- Encaminhamento Médico -->
        <div class="p-4 bg-neutral-50 rounded-lg space-y-3">
          <div class="flex items-center space-x-3">
            <input
              id="enc_medico"
              v-model="form.enc_medico"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="enc_medico" class="text-sm font-semibold text-neutral-900 cursor-pointer">
              Encaminhamento Médico
            </label>
          </div>

          <div v-if="form.enc_medico" class="space-y-3 pl-7">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Tipo de Médico
              </label>
              <select
                v-model="form.enc_medico_tipo"
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="null">Selecione...</option>
                <option value="clinico_geral">Clínico Geral</option>
                <option value="especialista">Especialista</option>
              </select>
            </div>

            <div v-if="form.enc_medico_tipo === 'especialista'">
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Especialista
              </label>
              <input
                v-model="form.enc_medico_especialista"
                type="text"
                placeholder="Digite a especialidade..."
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Encaminhamento Terapeuta -->
        <div class="p-4 bg-neutral-50 rounded-lg space-y-3">
          <div class="flex items-center space-x-3">
            <input
              id="enc_terapeuta"
              v-model="form.enc_terapeuta"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label for="enc_terapeuta" class="text-sm font-semibold text-neutral-900 cursor-pointer">
              Encaminhamento para Terapeuta
            </label>
          </div>

          <div v-if="form.enc_terapeuta" class="pl-7">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Especialista/Terapeuta
            </label>
            <input
              v-model="form.enc_terapeuta_especialista"
              type="text"
              placeholder="Digite o tipo de terapeuta..."
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- ABA 6: Plano Terapêutico -->
      <div v-show="abaAtiva === 'plano'" class="space-y-4">
        <!-- Plantas Medicinais -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Plantas Medicinais (Chás)
          </label>
          
          <!-- Dropdown para adicionar plantas -->
          <div class="mb-3">
            <select
              v-model="plantaSelecionada"
              :disabled="carregando"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
              @change="adicionarPlanta"
            >
              <option :value="null">Selecione uma planta para adicionar</option>
              <option
                v-for="planta in plantasDisponiveis"
                :key="planta.id"
                :value="planta.id"
              >
                {{ planta.nome_popular }}
                <template v-if="planta.nome_cientifico">
                  ({{ planta.nome_cientifico }})
                </template>
              </option>
            </select>
          </div>

          <!-- Lista de plantas adicionadas -->
          <div v-if="form.plantas.length > 0" class="space-y-2">
            <div
              v-for="(planta, index) in form.plantas"
              :key="index"
              class="flex items-start gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg"
            >
              <div class="flex-1">
                <div class="font-medium text-sm text-neutral-900">
                  {{ obterNomePlanta(planta.planta_id) }}
                </div>
                <textarea
                  v-model="planta.observacao_planta"
                  placeholder="Observações sobre esta planta (opcional)"
                  rows="2"
                  class="mt-2 w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <button
                type="button"
                @click="removerPlanta(index)"
                class="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Remover planta"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <p v-else class="text-sm text-neutral-500 italic">
            Nenhuma planta adicionada ainda
          </p>
        </div>

        <!-- Instruções Gerais -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Instruções Gerais
          </label>
          <textarea
            v-model="form.plano_instrucoes_gerais"
            rows="4"
            placeholder="Digite as instruções gerais para o paciente..."
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <!-- Dosagem e Período -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Dosagem (ml)
            </label>
            <input
              v-model.number="form.plano_dosagem_ml"
              type="number"
              min="0"
              placeholder="Ex: 50"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Período (horas)
            </label>
            <input
              v-model.number="form.plano_periodo_horas"
              type="number"
              min="0"
              placeholder="Ex: 8"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Duração (dias)
            </label>
            <input
              v-model.number="form.plano_duracao_dias"
              type="number"
              min="0"
              placeholder="Ex: 30"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Frequência de Sessões -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Frequência de Sessões
          </label>
          <input
            v-model="form.plano_sessoes_frequencia"
            type="text"
            placeholder="Ex: 2x por semana"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Observações -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Observações Gerais do Atendimento
          </label>
          <textarea
            v-model="form.observacoes"
            placeholder="Digite observações gerais sobre o atendimento..."
            rows="4"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <!-- Rodapé com botões -->
      <div class="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <BaseButton
          type="button"
          variant="secondary"
          @click="handleClose"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="!formularioValido || carregando"
        >
          {{ isEdicao ? 'Salvar Alterações' : 'Criar Atendimento' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { AtendimentoCompleto } from '~/types/database.types'

interface Props {
  modelValue: boolean
  isEdicao?: boolean
  atendimentoData?: AtendimentoCompleto | null
  clientes: any[]
  profissionais: any[]
  plantas: any[]
  carregando?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  atendimentoData: null,
  carregando: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'atendimento-salvo': [data: any]
  'cancel': []
  'close': []
}>()

// Abas
const abaAtiva = ref('basicos')
const abas = [
  { id: 'basicos', label: 'Dados Básicos' },
  { id: 'vitais', label: 'Sinais Vitais' },
  { id: 'centros', label: 'Centros Energéticos' },
  { id: 'cadernos', label: 'Cadernos' },
  { id: 'encaminhamentos', label: 'Encaminhamentos' },
  { id: 'plano', label: 'Plano Terapêutico' }
]

// Estado do formulário
const form = reactive({
  // Dados básicos
  cliente_id: null as number | null,
  profissional_id: null as number | null,
  eh_divino_auxiliar: false,
  pode_auxiliar: false,
  
  // Sinais vitais
  pressao_sistolica: null as number | null,
  pressao_diastolica: null as number | null,
  batimento_cardiaco: null as number | null,
  status_cardiaco: null as string | null,
  energia_vital: null as number | null,
  imunidade: null as string | null,
  meridiano: null as string | null,
  
  // Centros energéticos
  centro_coronario: false,
  centro_frontal: false,
  centro_laringeo: false,
  centro_cardiaco: false,
  centro_plexo_solar: false,
  centro_umbilical: false,
  centro_base: false,
  
  // Cadernos
  caderno_virus: false,
  caderno_bacteria: false,
  caderno_fungos: false,
  caderno_parasitas: false,
  caderno_micoplasma: false,
  caderno_bacilos: false,
  caderno_artrites: false,
  caderno_doencas: false,
  causas_desalinhamentos: null as string | null,
  modificados_outros: null as string | null,
  
  // Encaminhamentos
  enc_medico: false,
  enc_medico_tipo: null as string | null,
  enc_medico_especialista: null as string | null,
  enc_terapeuta: false,
  enc_terapeuta_especialista: null as string | null,
  
  // Plano terapêutico
  plano_instrucoes_gerais: null as string | null,
  plano_dosagem_ml: null as number | null,
  plano_periodo_horas: null as number | null,
  plano_duracao_dias: null as number | null,
  plano_sessoes_frequencia: null as string | null,
  observacoes: null as string | null,
  
  // Plantas
  plantas: [] as Array<{
    planta_id: number
    observacao_planta: string | null
  }>
})

const plantaSelecionada = ref<number | null>(null)

// Computed
const plantasDisponiveis = computed(() => {
  // Filtrar plantas que já foram adicionadas
  const idsAdicionados = form.plantas.map((p: any) => p.planta_id)
  return props.plantas.filter((p: any) => !idsAdicionados.includes(p.id))
})

const formularioValido = computed(() => {
  return form.cliente_id !== null && form.profissional_id !== null
})

// Funções auxiliares
const formatarCPF = (cpf: string) => {
  if (!cpf) return ''
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const getEnergiaVitalColor = (valor: number) => {
  if (valor >= 70) return 'bg-green-500'
  if (valor >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const obterNomePlanta = (plantaId: number) => {
  const planta = props.plantas.find((p: any) => p.id === plantaId)
  if (!planta) return 'Planta desconhecida'
  
  return planta.nome_cientifico
    ? `${planta.nome_popular} (${planta.nome_cientifico})`
    : planta.nome_popular
}

const adicionarPlanta = () => {
  if (plantaSelecionada.value) {
    form.plantas.push({
      planta_id: plantaSelecionada.value,
      observacao_planta: null
    })
    plantaSelecionada.value = null
  }
}

const removerPlanta = (index: number) => {
  form.plantas.splice(index, 1)
}

const resetarFormulario = () => {
  // Dados básicos
  form.cliente_id = null
  form.profissional_id = null
  form.eh_divino_auxiliar = false
  form.pode_auxiliar = false
  
  // Sinais vitais
  form.pressao_sistolica = null
  form.pressao_diastolica = null
  form.batimento_cardiaco = null
  form.status_cardiaco = null
  form.energia_vital = null
  form.imunidade = null
  form.meridiano = null
  
  // Centros energéticos
  form.centro_coronario = false
  form.centro_frontal = false
  form.centro_laringeo = false
  form.centro_cardiaco = false
  form.centro_plexo_solar = false
  form.centro_umbilical = false
  form.centro_base = false
  
  // Cadernos
  form.caderno_virus = false
  form.caderno_bacteria = false
  form.caderno_fungos = false
  form.caderno_parasitas = false
  form.caderno_micoplasma = false
  form.caderno_bacilos = false
  form.caderno_artrites = false
  form.caderno_doencas = false
  form.causas_desalinhamentos = null
  form.modificados_outros = null
  
  // Encaminhamentos
  form.enc_medico = false
  form.enc_medico_tipo = null
  form.enc_medico_especialista = null
  form.enc_terapeuta = false
  form.enc_terapeuta_especialista = null
  
  // Plano terapêutico
  form.plano_instrucoes_gerais = null
  form.plano_dosagem_ml = null
  form.plano_periodo_horas = null
  form.plano_duracao_dias = null
  form.plano_sessoes_frequencia = null
  form.observacoes = null
  
  // Plantas
  form.plantas = []
  plantaSelecionada.value = null
  
  // Resetar aba ativa
  abaAtiva.value = 'basicos'
}

const preencherFormulario = (atendimento: AtendimentoCompleto) => {
  const atendAny = atendimento as any
  
  // Dados básicos
  form.cliente_id = atendAny.cliente_id
  form.profissional_id = atendAny.profissional_id
  form.eh_divino_auxiliar = atendAny.eh_divino_auxiliar || false
  form.pode_auxiliar = atendAny.pode_auxiliar || false
  
  // Sinais vitais
  form.pressao_sistolica = atendAny.pressao_sistolica
  form.pressao_diastolica = atendAny.pressao_diastolica
  form.batimento_cardiaco = atendAny.batimento_cardiaco
  form.status_cardiaco = atendAny.status_cardiaco
  form.energia_vital = atendAny.energia_vital
  form.imunidade = atendAny.imunidade
  form.meridiano = atendAny.meridiano
  
  // Centros energéticos
  form.centro_coronario = atendAny.centro_coronario || false
  form.centro_frontal = atendAny.centro_frontal || false
  form.centro_laringeo = atendAny.centro_laringeo || false
  form.centro_cardiaco = atendAny.centro_cardiaco || false
  form.centro_plexo_solar = atendAny.centro_plexo_solar || false
  form.centro_umbilical = atendAny.centro_umbilical || false
  form.centro_base = atendAny.centro_base || false
  
  // Cadernos
  form.caderno_virus = atendAny.caderno_virus || false
  form.caderno_bacteria = atendAny.caderno_bacteria || false
  form.caderno_fungos = atendAny.caderno_fungos || false
  form.caderno_parasitas = atendAny.caderno_parasitas || false
  form.caderno_micoplasma = atendAny.caderno_micoplasma || false
  form.caderno_bacilos = atendAny.caderno_bacilos || false
  form.caderno_artrites = atendAny.caderno_artrites || false
  form.caderno_doencas = atendAny.caderno_doencas || false
  form.causas_desalinhamentos = atendAny.causas_desalinhamentos
  form.modificados_outros = atendAny.modificados_outros
  
  // Encaminhamentos
  form.enc_medico = atendAny.enc_medico || false
  form.enc_medico_tipo = atendAny.enc_medico_tipo
  form.enc_medico_especialista = atendAny.enc_medico_especialista
  form.enc_terapeuta = atendAny.enc_terapeuta || false
  form.enc_terapeuta_especialista = atendAny.enc_terapeuta_especialista
  
  // Plano terapêutico
  form.plano_instrucoes_gerais = atendAny.plano_instrucoes_gerais
  form.plano_dosagem_ml = atendAny.plano_dosagem_ml
  form.plano_periodo_horas = atendAny.plano_periodo_horas
  form.plano_duracao_dias = atendAny.plano_duracao_dias
  form.plano_sessoes_frequencia = atendAny.plano_sessoes_frequencia
  form.observacoes = atendAny.observacoes
  
  // Preencher plantas
  if (atendimento.plantas && atendimento.plantas.length > 0) {
    form.plantas = atendimento.plantas.map((p: any) => ({
      planta_id: p.id,
      observacao_planta: p.observacao_planta
    }))
  }
}

// Handlers
const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  if (!formularioValido.value) return

  const dados = {
    atendimento: {
      // Dados básicos
      cliente_id: form.cliente_id,
      profissional_id: form.profissional_id,
      eh_divino_auxiliar: form.eh_divino_auxiliar || null,
      pode_auxiliar: form.pode_auxiliar || null,
      
      // Sinais vitais
      pressao_sistolica: form.pressao_sistolica,
      pressao_diastolica: form.pressao_diastolica,
      batimento_cardiaco: form.batimento_cardiaco,
      status_cardiaco: form.status_cardiaco,
      energia_vital: form.energia_vital,
      imunidade: form.imunidade,
      meridiano: form.meridiano,
      
      // Centros energéticos
      centro_coronario: form.centro_coronario,
      centro_frontal: form.centro_frontal,
      centro_laringeo: form.centro_laringeo,
      centro_cardiaco: form.centro_cardiaco,
      centro_plexo_solar: form.centro_plexo_solar,
      centro_umbilical: form.centro_umbilical,
      centro_base: form.centro_base,
      
      // Cadernos
      caderno_virus: form.caderno_virus,
      caderno_bacteria: form.caderno_bacteria,
      caderno_fungos: form.caderno_fungos,
      caderno_parasitas: form.caderno_parasitas,
      caderno_micoplasma: form.caderno_micoplasma,
      caderno_bacilos: form.caderno_bacilos,
      caderno_artrites: form.caderno_artrites,
      caderno_doencas: form.caderno_doencas,
      causas_desalinhamentos: form.causas_desalinhamentos,
      modificados_outros: form.modificados_outros,
      
      // Encaminhamentos
      enc_medico: form.enc_medico,
      enc_medico_tipo: form.enc_medico_tipo,
      enc_medico_especialista: form.enc_medico_especialista,
      enc_terapeuta: form.enc_terapeuta,
      enc_terapeuta_especialista: form.enc_terapeuta_especialista,
      
      // Plano terapêutico
      plano_instrucoes_gerais: form.plano_instrucoes_gerais,
      plano_dosagem_ml: form.plano_dosagem_ml,
      plano_periodo_horas: form.plano_periodo_horas,
      plano_duracao_dias: form.plano_duracao_dias,
      plano_sessoes_frequencia: form.plano_sessoes_frequencia,
      observacoes: form.observacoes
    },
    plantas: form.plantas
  }

  emit('atendimento-salvo', dados)
  resetarFormulario()
}

// Watchers
watch(() => props.modelValue, (novoValor: boolean) => {
  if (novoValor) {
    if (props.isEdicao && props.atendimentoData) {
      preencherFormulario(props.atendimentoData)
    } else {
      resetarFormulario()
    }
  }
})
</script>
