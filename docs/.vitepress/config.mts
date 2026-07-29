import { defineConfig } from 'vitepress'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const docsDir = fileURLToPath(new URL('..', import.meta.url))

// 3級・2級の全章メタ情報（index.md の目次と対応）。
// ファイルが未執筆の章はサイドバーから自動的に除外される。
const kyu3Chapters = [
  ['3kyu/3kyu_chap01', '01. ロジスティクスとは何か'],
  ['3kyu/3kyu_chap02', '02. 経営とロジスティクスの関係'],
  ['3kyu/3kyu_chap03', '03. 物流を支える人・労働・環境問題'],
  ['3kyu/3kyu_chap04', '04. 物流に関する法律とルール'],
  ['3kyu/3kyu_chap05', '05. 包装の基本'],
  ['3kyu/3kyu_chap06', '06. 荷役とマテリアルハンドリング（MH）'],
  ['3kyu/3kyu_chap07', '07. 保管の基本'],
  ['3kyu/3kyu_chap08', '08. 輸配送システムの基本'],
  ['3kyu/3kyu_chap09', '09. 国際輸送の基本'],
  ['3kyu/3kyu_chap10', '10. 物流センターの計画'],
  ['3kyu/3kyu_chap11', '11. 物流センターの管理と運営'],
  ['3kyu/3kyu_chap12', '12. 物流サービスとシステムの管理'],
  ['3kyu/3kyu_chap13', '13. 在庫管理の基本'],
  ['3kyu/3kyu_chap14', '14. 物流コスト管理の基本'],
  ['3kyu/3kyu_chap15', '15. 物流情報システムの基本'],
  ['3kyu/3kyu_chap16', '16. 総まとめ・模擬問題'],
] as const

const kyu2Chapters = [
  ['2kyu/2kyu_chap01', '01. 企業経営とロジスティクス管理'],
  ['2kyu/2kyu_chap02', '02. ロジスティクス戦略とSCM'],
  ['2kyu/2kyu_chap03', '03. 物流サービス管理と顧客満足・品質'],
  ['2kyu/2kyu_chap04', '04. 包装・荷役・保管の応用管理'],
  ['2kyu/2kyu_chap05', '05. 輸配送システムの設計と最適化'],
  ['2kyu/2kyu_chap06', '06. 国際物流実務'],
  ['2kyu/2kyu_chap07', '07. 物流センターの立地・レイアウト計画'],
  ['2kyu/2kyu_chap08', '08. 物流センターの運営管理'],
  ['2kyu/2kyu_chap09', '09. 3PL・物流不動産・アウトソーシング戦略'],
  ['2kyu/2kyu_chap10', '10. 在庫管理の理論'],
  ['2kyu/2kyu_chap11', '11. 物流コスト管理・分析'],
  ['2kyu/2kyu_chap12', '12. 物流情報システムとDX'],
  ['2kyu/2kyu_chap13', '13. 環境・CSR・法規制対応の高度化'],
  ['2kyu/2kyu_chap14', '14. 総まとめ・模擬問題'],
] as const

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
