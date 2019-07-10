import defaultSettings from '@/settings'

const title = defaultSettings.title || '矩视管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
