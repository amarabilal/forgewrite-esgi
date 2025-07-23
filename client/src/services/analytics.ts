declare global {
  interface Window {
    _paq?: any[]
  }
}

function trackEvent(category: string, action: string, name?: string, value?: number) {
  window._paq?.push(['trackEvent', category, action, name, value])
}

function trackTimer(category: string, action: string, time: number) {
  window._paq?.push(['trackEvent', category, action, undefined, time])
}

export default {
  trackEvent,
  trackTimer,
}
