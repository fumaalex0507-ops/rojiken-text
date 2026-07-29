import { defineConfig } from 'vitepress'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { kyu3Chapters, kyu2Chapters } from './chapterList'

const docsDir = fileURLToPath(new URL('..', import.meta.url))

// 章ファイルが未執筆の場合はサイドバーから自動的に除外される。

function toSidebarItems(chapters: readonly (readonly [string, string])[]) {
  return chapters
    .filter(([link]) => existsSync(path.join(docsDir, `${link}.md`)))
    .map(([link, text]) => ({ text, link: `/${link}` }))
}

export default defineConfig({
  title: 'ロジ検ノート',
  description: 'ロジスティクス検定 3級・2級 攻略ノート',
  lang: 'ja',
  base: '/rojiken-text/',
  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/rojiken-text/favicon-32x32.png', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/rojiken-text/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/rojiken-text/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#2c3e50' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'ロジ検ノート' }],
  ],

  themeConfig: {
    nav: [
      { text: '目次', link: '/' },
      { text: '3級', link: '/3kyu/3kyu_chap01' },
      { text: '2級', link: '/2kyu/2kyu_chap01' },
    ],

    sidebar: {
      '/3kyu/': [
        { text: '第1部｜基礎を知る', items: toSidebarItems(kyu3Chapters.slice(0, 4)) },
        { text: '第2部｜現場を知る', items: toSidebarItems(kyu3Chapters.slice(4, 11)) },
        { text: '第3部｜管理を知る', items: toSidebarItems(kyu3Chapters.slice(11, 16)) },
      ],
      '/2kyu/': [
        { text: '第1部｜経営戦略', items: toSidebarItems(kyu2Chapters.slice(0, 3)) },
        { text: '第2部｜高度オペレーション', items: toSidebarItems(kyu2Chapters.slice(3, 9)) },
        { text: '第3部｜データ管理', items: toSidebarItems(kyu2Chapters.slice(9, 14)) },
      ],
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '検索', buttonAriaLabel: '検索' },
              modal: {
                noResultsText: '該当する結果がありません',
                resetButtonTitle: 'リセット',
                footer: { selectText: '選択', navigateText: '移動', closeText: '閉じる' },
              },
            },
          },
        },
      },
    },

    outline: { label: 'このページの目次' },
    docFooter: { prev: '前の章', next: '次の章' },
    returnToTopLabel: 'トップへ戻る',
    darkModeSwitchLabel: '表示切替',
    sidebarMenuLabel: 'メニュー',
  },
})
