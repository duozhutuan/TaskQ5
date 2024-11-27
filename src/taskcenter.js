import {sendRequest,recvRquest,requestTask} from './do_requests.js';
import {recv_task} from './recvtask.js'; 
import {channel_info,relays,relayServer} from './config.js'
import { WebSocketServer } from 'ws'; 

let dispatch = [
    requestTask
]

async function handleEvent(Event){
    
   try {
       let content = JSON.parse(Event.content)
             
       for(let t of dispatch ){
          if (t["type"] == content["type"]) {
            await t.cb(Event)   
          }
       };   
  } catch(e){ }

}

recv_task(channel_info.id,handleEvent)


let port = 8088
const wss = new WebSocketServer({ port: port });


wss.on('connection', (ws,req) => {
     ws.on('message', (message) => {
          if (Buffer.isBuffer(message)) {
               message = message.toString('utf-8');
               message = JSON.parse(message)
          }

        console.log("send to relay server type = ",message.type)
        if (message.type == 'requests'){
            sendRequest(message,(content)=>{
                ws.send(JSON.stringify({type:"response",status:'200',data:content.data}))
            });

        }

     })
});

console.log(`You can connect via WebSocket and publish tasks. ws://localhost:${port}`);


