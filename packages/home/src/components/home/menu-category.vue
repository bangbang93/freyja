<template>
  <div @mouseenter="onMouseEnter">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {useHomeStore} from '../../store/home.ts'

const homeStore = useHomeStore()

await homeStore.getCategories()
function onMouseEnter(): void {}
</script>
