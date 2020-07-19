import {createDevServer} from './start'

async function dev() {
  const server = await createDevServer()

  return server.listen()
}

dev().catch((err) => {
  console.log(err)
  process.exit(1)
})
