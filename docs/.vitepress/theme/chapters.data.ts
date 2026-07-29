import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { kyu3Chapters, kyu2Chapters } from '../chapterList'

const docsDir = fileURLToPath(new URL('../..', import.meta.url))

export interface ChapterProgressInfo {
  path: string
  title: string
  items: string[]
}

export interface ChaptersData {
  kyu3: ChapterProgressInfo[]
  kyu2: ChapterProgressInfo[]
}

function extractChecklistItems(src: string): string[] {
  const marker = '## この章の理解度チェックリスト'
  const start = src.indexOf(marker)
  if (start === -1) return []

  const rest = src.slice(start + marker.length)
  const nextHeading = rest.search(/\n##\s/)
  const section = nextHeading === -1 ? rest : rest.slice(0, nextHeading)

  const items: string[] = []
  for (const line of section.split('\n')) {
    const match = line.match(/^-\s*\[[ xX]\]\s*(.+)$/)
    if (match) items.push(match[1].trim())
  }
  return items
}

function buildChapters(list: readonly (readonly [string, string])[]): ChapterProgressInfo[] {
  return list
    .filter(([chapterPath]) => fs.existsSync(path.join(docsDir, `${chapterPath}.md`)))
    .map(([chapterPath, title]) => {
      const src = fs.readFileSync(path.join(docsDir, `${chapterPath}.md`), 'utf-8')
      return { path: chapterPath, title, items: extractChecklistItems(src) }
    })
}

declare const data: ChaptersData
export { data }

export default {
  watch: ['../../3kyu/*.md', '../../2kyu/*.md'],
  load(): ChaptersData {
    return {
      kyu3: buildChapters(kyu3Chapters),
      kyu2: buildChapters(kyu2Chapters),
    }
  },
}
