<script setup lang="ts">
import { cn } from '~/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type InputVariants = VariantProps<typeof inputVariants>

interface Props {
  variant?: InputVariants['variant']
  modelValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :class="cn(inputVariants({ variant }))"
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="onInput"
  />
</template>
