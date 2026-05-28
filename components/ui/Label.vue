<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  class?: string
  for?: string
}
</script>

<template>
  <label
    :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', $props.class)"
    :for="$props.for"
  >
    <slot />
  </label>
</template>
