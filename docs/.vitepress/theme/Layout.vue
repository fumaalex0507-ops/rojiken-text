<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import { enhanceChecklist } from './checklist'

const { page } = useData()

function run() {
  const chapterPath = page.value.relativePath.replace(/\.md$/, '')
  nextTick(() => enhanceChecklist(chapterPath))
}

onMounted(run)
watch(() => page.value.relativePath, run)
</script>

<template>
  <DefaultTheme.Layout />
</template>
