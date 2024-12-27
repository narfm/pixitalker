interface Visual {
  emoji: string
  count: number
}

interface ParsedExample {
  setup: string
  visuals: Visual[]
  operation: string
  explanation: string
  result: string
}

export function parseExample(exampleXml: string): ParsedExample {
  const parser = new DOMParser()
  const doc = parser.parseFromString(exampleXml, 'text/xml')

  // Parse setup text, preserving emojis in objects
  const setupElement = doc.querySelector('setup')
  let setup = ''
  if (setupElement) {
    setupElement.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        setup += node.textContent
      } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'object') {
        const element = node as Element
        const emoji = element.getAttribute('emoji') || ''
        const count = element.getAttribute('count') || ''
        setup += `${emoji} ${count} ${element.textContent}`
      }
    })
  }

  // Parse visuals with emoji attributes
  const visuals: Visual[] = Array.from(doc.querySelectorAll('visuals object')).map(obj => ({
    emoji: obj.getAttribute('emoji') || '🔵',
    count: parseInt(obj.getAttribute('count') || '0', 10)
  }))

  const operation = doc.querySelector('operation')?.textContent?.trim() || ''
  const explanation = doc.querySelector('explanation')?.textContent?.trim() || ''
  const result = doc.querySelector('result')?.textContent?.trim() || ''

  return {
    setup,
    visuals,
    operation,
    explanation,
    result
  }
} 