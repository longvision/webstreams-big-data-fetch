
const API_URL = 'http://localhost:8080'
let counter=0;



// 
async function consumeAPI(signal){
  const response = await fetch(API_URL, { signal })
  const reader = response.body
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(parseNDJSON())
  //uncomment for debbuging
//   .pipeTo(new WritableStream({
//     write(chunk){
//       console.log(++counter,'chunk', chunk)
//     }
//   }))
  return reader
}


function parseNDJSON(){
    let ndjsonBuffer=''
    return new TransformStream({
        transform(chunk, controller){
        ndjsonBuffer += chunk
        const items = ndjsonBuffer.split('\n')
        items.slice(0,-1).forEach(item => controller.enqueue(JSON.parse(item)))
        ndjsonBuffer = items[items.length-1]
        },
        flush(controller){
            if(!ndjsonBuffer) return
            controller.enqueue(JSON.parse(ndjsonBuffer))
        }
    })
}

function appendToHTML(el){
    return new WritableStream({
        write({title, overview, popularity}){
            const card = `
                <div class="text">
                    <h3 class="title">[${++counter}] - ${title}</h3>
                    <p class ="overview">${overview.slice(0, 100)}</p>
                    <p class ="popularity">${popularity}</p>
                </div>`
            el.innerHTML += card 
        }, 
        abort(reason){
            console.log("Aborted", reason)
        }
    }
)}

const [start,stops,movies]= ['start','stop','movies'].map(id=>document.getElementById(id))
let abortController = new AbortController()


start.addEventListener('click', async ()=>{
    const readable = await consumeAPI(abortController.signal)
    readable.pipeTo(appendToHTML(movies))
})

stops.addEventListener('click', ()=>{
    abortController.abort()
    console.log('aborting...')
    abortController = new AbortController()
})