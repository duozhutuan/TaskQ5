import axios from 'axios'
import {connectBridge,sendMessage} from './nostrBridge_client.js'
import {send_task,update_task} from './sendtask.js'
export function doRequest(content,callback) {
       console.log(content.url)
       axios.get(content.url,{headers:content.headers})
        .then(response=>{
            callback(response.data)
        })
        .catch(error => {
            callback(null);
        });
}

//bridge message
function handle_send_message(socket,message,req_task,finishTask){
        if (message.action == "clientId" ){
            req_task["clientId"] = message.content
            let taskevent = send_task (JSON.stringify(req_task));
            console.log("task id",taskevent.id)
        }
        if (message.action == 'message'){
            let content = message.message
            if (content.type == 'response'){
                console.log("Done EventId: ", content.eventid)
                update_task("done",content.eventid)
                finishTask(content);
            }
        } 
}


export function sendRequest(req_task,finishTask){

    
    connectBridge(req_task['Bridge'],(socket,message)=>{
            handle_send_message(socket,message,req_task,finishTask);
    });

}

//bridge message 

function handle_recv_message(socket,message,reqcontent){
    return new Promise((resolve, reject) => {    
        if (message.action == "clientId"){
            let clientId = message.content;
            doRequest(reqcontent,(data)=>{
                console.log(reqcontent.id,data.length)
                sendMessage(socket,reqcontent.clientId,clientId,
                                            {type:"response",
                                            data:data,
                                            eventid:reqcontent.id});
                return resolve("request done");
            })
        }

    })
}
export async function recvRquest(data) {
    let content = JSON.parse(data.content) 
    content['id'] = data.id
    return new Promise((resolve, reject) => { 
        if (content['Bridge'] && content['clientId']){ 
            connectBridge(content['Bridge'],async (socket,message)=>{
                await handle_recv_message(socket,message,content);
                return resolve('recv done');
            });
        } else {

                return resolve('requests version not match');
        }

    })
}

export let requestTask = {
    "type":"requests",
    "cb":recvRquest
} 
