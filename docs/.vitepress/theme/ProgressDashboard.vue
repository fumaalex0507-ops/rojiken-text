<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { data as chapters } from './chapters.data'
import { loadProgress, resetProgress, UPDATE_EVENT, type ProgressState } from './checklist'

const progress = ref<ProgressState>({})

function refresh() {
  progress.value = loadProgress()
}

onMounted(() => {
  refresh()
  window.addEventListener(UPDATE_EVENT, refresh)
  window.addEventListener('storage', refresh)
})

onUnmounted(() => {
  window.removeEventListener(UPDATE_EVENT, refresh)
  window.removeEventListener('storage', refresh)
})

function doneCount(chapterPath: string, total: number) {
  const state = progress.value[chapterPath] || {}
  let done = 0
  for (let i = 0; i < total; i++) if (state[i]) done++
  return done
}

function pct(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

const kyu3Rows = computed(() =>
  chapters.kyu3
    .filter((c) => c.items.length > 0)
    .map((c) => ({ ...c, total: c.items.length, done: doneCount(c.path, c.items.length) })),
)
const kyu2Rows = computed(() =>
  chapters.kyu2
    .filter((c) => c.items.length > 0)
    .map((c) => ({ ...c, total: c.items.length, done: doneCount(c.path, c.items.length) })),
)

const overall = computed(() => {
  const rows = [...kyu3Rows.value, ...kyu2Rows.value]
  const total = rows.reduce((sum, c) => sum + c.total, 0)
  const done = rows.reduce((sum, c) => sum + c.done, 0)
  return { done, total, pct: pct(done, total) }
})

function onReset() {
  if (typeof window === 'undefined') return
  if (!window.confirm('すべての章のチェック状態をリセットします。よろしいですか？')) return
  resetProgress()
  refresh()
}
</script>

<template>
  <div class="rojiken-dashboard">
    <div class="rojiken-dashboard-summary">
      <div class="rojiken-summary-head">
        <strong>全体の学習進捗</strong>
        <span class="rojiken-count">{{ overall.done }} / {{ overall.total }} 項目（{{ overall.pct }}%）</span>
      </div>
      <div class="rojiken-bar">
        <div class="rojiken-bar-fill" :style="{ width: overall.pct + '%' }" />
      </div>
      <button type="button" class="rojiken-reset" @click="onReset">チェックをすべてリセット</button>
    </div>

    <div class="rojiken-kyu-block">
      <h4>3級</h4>
      <ul class="rojiken-chapter-list">
        <li v-for="c in kyu3Rows" :key="c.path">
          <a :href="withBase('/' + c.path)">{{ c.title }}</a>
          <div class="rojiken-bar small">
            <div class="rojiken-bar-fill" :style="{ width: pct(c.done, c.total) + '%' }" />
          </div>
          <span class="rojiken-count">{{ c.done }}/{{ c.total }}</span>
        </li>
      </ul>
    </div>

    <div class="rojiken-kyu-block">
      <h4>2級</h4>
      <ul class="rojiken-chapter-list">
        <li v-for="c in kyu2Rows" :key="c.path">
          <a :href="withBase('/' + c.path)">{{ c.title }}</a>
          <div class="rojiken-bar small">
            <div class="rojiken-bar-fill" :style="{ width: pct(c.done, c.total) + '%' }" />
          </div>
          <span class="rojiken-count">{{ c.done }}/{{ c.total }}</span>
        </li>
      </ul>
    </div>

    <p class="rojiken-note">
      ※ 進捗はこの端末のブラウザ内（localStorage）にのみ保存されます。別の端末・ブラウザとは共有されません。
    </p>
  </div>
</template>

<style scoped>
.rojiken-dashboard {
  margin: 1.5rem 0;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.rojiken-dashboard-summary {
  margin-bottom: 1.25rem;
}

.rojiken-summary-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.rojiken-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: var(--vp-c-bg-alt);
  overflow: hidden;
}

.rojiken-bar.small {
  height: 6px;
  flex: 1;
  margin: 0 0.75rem;
}

.rojiken-bar-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 999px;
  transition: width 0.2s ease;
}

.rojiken-reset {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  cursor: pointer;
}

.rojiken-reset:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.rojiken-kyu-block {
  margin-top: 1rem;
}

.rojiken-kyu-block h4 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
}

.rojiken-chapter-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rojiken-chapter-list li {
  display: flex;
  align-items: center;
  padding: 0.35rem 0;
  font-size: 0.9rem;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.rojiken-chapter-list li a {
  flex: 0 0 auto;
  min-width: 9rem;
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}

.rojiken-count {
  flex: 0 0 auto;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.rojiken-note {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}
</style>
