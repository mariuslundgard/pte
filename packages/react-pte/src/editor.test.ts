import puppeteer, {Browser} from 'puppeteer'
import {ViteDevServer} from 'vite'
import {createDevServer} from '../test/server/start'

let server: ViteDevServer
let browser: Browser

beforeAll(async () => {
  server = await createDevServer({silent: true})
  server.listen()

  browser = await puppeteer.launch()
})

afterAll(async () => {
  await server.close()
  await browser.close()
})

test('should insert and remove text', async () => {
  const page = await browser.newPage()

  await page.goto('http://localhost:8080')
  await page.waitForSelector('#editor')

  const editorHandle = await page.$('#editor')

  expect(editorHandle).not.toBeNull()

  const documentHandle = await page.evaluateHandle('document')

  // Select text
  await documentHandle.evaluate((document: Document) => {
    const spanEl = document.querySelector('[data-text][data-offset="1"][data-chunk-offset="0"]')

    if (spanEl && spanEl.firstChild) {
      const selection = document.getSelection()

      if (!selection) {
        throw new Error('Expected selection')
      }

      selection.removeAllRanges()

      const range = document.createRange()

      range.selectNodeContents(spanEl?.firstChild)
      selection.addRange(range)
    }
  })

  // Trigger `beforeinput`
  editorHandle?.evaluate((el: Element) => {
    el.dispatchEvent(
      new InputEvent('beforeinput', {
        inputType: 'insertText',
        data: 'test',
      })
    )
  })

  const spanHandle = await page.$('[data-text][data-offset="1"][data-chunk-offset="0"]')

  const text1 = await spanHandle?.evaluate((el) => el.innerHTML)

  expect(text1).toEqual('test')

  // Trigger `beforeinput`
  editorHandle?.evaluate((el: Element) => {
    // backspace
    el.dispatchEvent(
      new InputEvent('beforeinput', {
        inputType: 'deleteContentBackward',
      })
    )

    // backspace
    el.dispatchEvent(
      new InputEvent('beforeinput', {
        inputType: 'deleteContentBackward',
      })
    )

    el.dispatchEvent(new Event('blur'))
  })

  const text2 = await spanHandle?.evaluate((el) => el.innerHTML)

  expect(text2).toEqual('te')
})
