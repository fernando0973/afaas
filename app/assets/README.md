# Assets

Esta pasta contém recursos estáticos processados pelo Vite (fontes, ícones, imagens).

## Estrutura

- `images/` - Imagens que serão processadas (otimizadas/importadas)
- Adicione outras subpastas conforme necessário (fonts, icons, etc.)

## Uso

Para usar imagens desta pasta nos componentes:

```vue
<script setup lang="ts">
import logo from '~/assets/images/logo.png'
</script>

<template>
  <img :src="logo" alt="Logo AFAAS" />
</template>
```

Ou diretamente:

```vue
<template>
  <img src="~/assets/images/logo.png" alt="Logo AFAAS" />
</template>
```

## Diferença entre `assets/` e `public/`

- **`app/assets/`**: Arquivos processados pelo Vite (otimizados, versionados)
- **`public/`**: Arquivos servidos como estão, acessíveis via `/arquivo.ext`
