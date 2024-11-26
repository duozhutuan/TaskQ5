import {sendRequest,recvRquest,requestTask} from './do_requests.js';
import {recv_task} from './recvtaskNDK.js'; 
import {channel_info,relays,relayServer} from './config.js'

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


