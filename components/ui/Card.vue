<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  class?: string
}
</script>

<template>
  <div :class="cn('rounded-xl border bg-card text-card-foreground shadow', $props.class)">
    <slot />
  </div>
</template>
