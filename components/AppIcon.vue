<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  name: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <Icon :icon="name" :class="$props.class" />
</template>
