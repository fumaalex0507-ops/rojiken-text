// 章末「理解度チェックリスト」のチェック状態をブラウザのlocalStorageに永続化する。
// キーは章のパス（例: '3kyu/3kyu_chap01'）→ 項目インデックス → 真偽値。
export const STORAGE_KEY = 'rojiken-progress-v1'
export const UPDATE_EVENT = 'rojiken-progress-updated'

export type ProgressState = Record<string, Record<number, boolean>>

export function loadProgress(): ProgressState {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

export function resetProgress() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

// 現在表示中のページ内で「この章の理解度チェックリスト」の直後にある
// <ul> の各 <li>（例: "[ ] 物流の6大機能を..."）を、
// 実際にクリックできるチェックボックスへ差し替える。
export function enhanceChecklist(chapterPath: string) {
  if (typeof document === 'undefined') return

  const heading = Array.from(document.querySelectorAll('.vp-doc h2')).find((h) =>
    (h.textContent || '').includes('理解度チェックリスト'),
  )
  if (!heading) return

  let list: Element | null = heading.nextElementSibling
  while (list && list.tagName !== 'UL') list = list.nextElementSibling
  if (!list) return

  const items = Array.from(list.children).filter((el) => el.tagName === 'LI') as HTMLLIElement[]
  const state = loadProgress()
  const chapterState = state[chapterPath] || {}

  items.forEach((li, index) => {
    if (li.querySelector('input[type="checkbox"]')) return // 差し替え済み

    const text = (li.textContent || '').trim()
    const match = text.match(/^\[[ xX]\]\s*(.*)$/)
    if (!match) return

    li.textContent = ''
    li.classList.add('rojiken-check-item')

    const label = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = !!chapterState[index]
    checkbox.addEventListener('change', () => {
      const current = loadProgress()
      if (!current[chapterPath]) current[chapterPath] = {}
      current[chapterPath][index] = checkbox.checked
      saveProgress(current)
    })

    const span = document.createElement('span')
    span.textContent = match[1]

    label.appendChild(checkbox)
    label.appendChild(span)
    li.appendChild(label)
  })
}
