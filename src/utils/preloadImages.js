function preloadOne(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    const done = () => resolve()
    img.onload = done
    img.onerror = done
    img.src = src
  })
}

/**
 * Görselleri tarayıcı önbelleğine alır (splash / ilk açılış için).
 */
export async function preloadImages(srcList, { concurrency = 3 } = {}) {
  const urls = [...new Set(srcList.filter((s) => typeof s === 'string' && s.length > 0))]
  if (urls.length === 0) return

  let next = 0
  async function worker() {
    while (next < urls.length) {
      const i = next++
      await preloadOne(urls[i])
    }
  }

  const workers = Math.min(concurrency, urls.length)
  await Promise.all(Array.from({ length: workers }, () => worker()))
}
