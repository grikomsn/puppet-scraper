export default function extractor() {
  let links: { id: number; title: string; url: string }[] = []

  const entry = document.querySelectorAll('.athing')
  ;(entry as NodeListOf<HTMLElement>).forEach($entry => {
    const $storylink: HTMLAnchorElement = $entry.querySelector('.storylink')

    const id = parseInt($entry.id)
    const title = $storylink.innerText
    const url = $storylink.href

    links.push({ id, title, url })
  })

  return links
}
