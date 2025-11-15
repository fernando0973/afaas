# Componentes Base - Documentação

Este projeto agora possui componentes base padronizados para criar interfaces consistentes.

## BaseSection

Componente para seções principais do formulário com cabeçalho numerado.

### Props

- `number`: Número da seção (string | number)
- `title`: Título da seção
- `description`: Descrição da seção
- `variant`: Cor do tema ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info')
- `size`: Tamanho do padding ('sm' | 'md' | 'lg')
- `shadow`: Adiciona sombra (boolean)
- `border`: Adiciona borda (boolean)
- `contentClass`: Classes CSS customizadas para o conteúdo

### Exemplo de uso

```vue
<BaseSection 
  number="1"
  title="Dados Básicos"
  description="Informações fundamentais do atendimento"
  variant="primary"
  size="lg"
  content-class="space-y-6"
>
  <!-- Conteúdo da seção aqui -->
  <div class="grid grid-cols-2 gap-4">
    <!-- inputs, etc -->
  </div>
</BaseSection>
```

## BaseSubCard

Componente para subcards com checkbox opcional e conteúdo recolhível.

### Props

- `title`: Título do card
- `description`: Descrição do card
- `checkboxLabel`: Label do checkbox (se fornecido, transforma em card recolhível)
- `checkboxId`: ID do checkbox
- `modelValue`: Estado do checkbox (boolean)
- `variant`: Estilo do card ('primary' | 'secondary' | 'neutral')
- `size`: Tamanho do padding ('sm' | 'md' | 'lg')
- `collapsible`: Se o card é recolhível (boolean)

### Exemplo de uso

```vue
<!-- Card com checkbox recolhível -->
<BaseSubCard
  v-model="form.enc_medico"
  checkbox-label="Encaminhamento Médico"
  checkbox-id="enc_medico"
  variant="neutral"
  size="md"
>
  <div class="space-y-4">
    <!-- Conteúdo do card -->
    <BaseInput
      v-model="form.enc_medico_especialista"
      label="Especialidade"
      placeholder="Digite a especialidade..."
    />
  </div>
</BaseSubCard>

<!-- Card simples -->
<BaseSubCard
  title="Informações"
  description="Dados complementares"
  variant="primary"
>
  <!-- Conteúdo sempre visível -->
</BaseSubCard>
```

## Benefícios

1. **Consistência visual**: Todos os cards e seções seguem o mesmo padrão
2. **Reutilização**: Componentes podem ser usados em qualquer lugar
3. **Manutenibilidade**: Mudanças de estilo centralizadas nos componentes
4. **Acessibilidade**: IDs e labels corretamente configurados
5. **Responsividade**: Designs adaptáveis incluídos

## Migrações Realizadas

### atendimentos.vue

- ✅ 6 seções principais convertidas para `BaseSection`
- ✅ 2 subcards de encaminhamento convertidos para `BaseSubCard`
- ✅ Todos os inputs substituídos por `BaseInput`
- ✅ Todas as textareas substituídas por `BaseTextarea`
- ✅ Todos os botões substituídos por `BaseButton`

### Resultado

- Interface mais limpa e consistente
- Código mais legível e manutenível
- Componentes reutilizáveis em todo o projeto
- Padrão de design system estabelecido
