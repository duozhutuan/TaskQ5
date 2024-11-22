import {sendRequest,recvRquest,requestTask} from './do_requests.js';
import {recv_task} from './recvtask.js'; 
import {channel_info,relays,relayServer} from './config.js'

let dispatch = [
    requestTask
]

async function start_execute()
{
    let tasks = await recv_task(channel_info.id)

    if (tasks.length < 1) return ;

    for (let data of tasks) {
             try { 
                let content = JSON.parse(data.content)
             
                for(let t of dispatch ){
                    if (t["type"] == content["type"]) {
                        await t.cb(data)   
                    }
                };   
            } catch(e){
                
            }
    }          
}

setInterval(start_execute, 5000);  // 每5秒查询一次
