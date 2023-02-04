
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'
import { WritableStream, TransformStream } from 'node:stream/web'
import { setTimeout } from 'node:timers/promises'
import csvtojson from 'csvtojson'

const PORT = 8080

createServer(async (request, response) => {
  let counter = 0;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers)
    response.end()
    return
  }


  const transformToJson = () => Transform.toWeb(csvtojson())

  const transformToMappedObject = () => {
    return new TransformStream({
      transform(chunk, controller) {
        const data = JSON.parse(Buffer.from(chunk).toString())
        const mappedMovie = {
          title: data.original_title,
          overview: data.overview,
          popularity: data.popularity,
        }
        controller.enqueue(JSON.stringify(mappedMovie).concat('\n'))
      }
    })
  }

  const streamResponse = (response) => {
    return new WritableStream({
      async write(chunk) {
        // Uncomment below line of code if you want to see the data flowing with delay.
        await setTimeout(150)
        counter++
        response.write(chunk)
        console.log('Data sent', counter, chunk.toString())
      },
      close() {
        response.end()
      }
    })
  }

  Readable.toWeb(createReadStream('./movies_metadata.csv'))
    .pipeThrough(transformToJson())
    .pipeThrough(transformToMappedObject())
    .pipeTo(streamResponse(response))

  response.writeHead(200, headers)

  request.once('close', _ => console.log('Connection closed', counter))

})
  .listen(PORT)
  .on('listening', _ => {
    console.log(`Server is listening on port ${PORT}`)
  })
