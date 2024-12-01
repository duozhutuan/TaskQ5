import axios from 'axios'
import {connectBridge,sendMessage} from './nostrBridge_client.js'
import {send_task,update_task} from './sendtask.js'
import {Keypub} from './getkey.js'


export function doRequest(content,callback) {
       console.log(content.url )
       if (typeof content.headers === 'string') {    
            content.headers = JSON.parse(content.headers);
       }
       axios.get(content.url,{headers:content.headers})
        .then(response=>{
            callback(response)
        })
        .catch(error => {
            console.log(error)
            callback(null);
        });
}

//bridge message
async function handle_send_message(socket,message,req_task,finishTask,progressValue){

        if (message.action == "clientId" ){
            req_task["clientId"] = message.content
            console.log("clientId:",message.content)
            let taskevent = await send_task (JSON.stringify(req_task));
        }
        if (message.action == 'message'){
            let content = message.message
            if (content.type == 'ping'){
                //swap from,to
		if (progressValue == 0){
                	sendMessage(socket,message.from,message.to,{type:'pong'})
			progressValue = 1;
		} else {
			sendMessage(socket,message.from,message.to,{type:'taskTaken'})
		}
            }

            if (content.type == 'response'){
		progressValue = 2;    
                console.log("Done EventId: ", content.eventid)
                update_task(req_task,content.eventid,content.identifer,content.pubkey)
                finishTask(content);
                socket.close();
            }
        } 
}


export function sendRequest(req_task,finishTask){
    let progressValue = 0
    connectBridge(req_task['Bridge'],(socket,message)=>{
           processValue =  handle_send_message(socket,message,req_task,finishTask,progressValue);
    });
}



//bridge message 

function handle_recv_message(socket,message,reqcontent){
   //console.log(message)
   return new Promise((resolve, reject) => {    

        if (message.action == "clientId"){
            let clientId = message.content;
            sendMessage(socket,reqcontent.clientId,clientId,{type:'ping'})
            return resolve(302)
        }

        if (message.action == "message"){
            if (message.code != 200) {
                return resolve(message.code)
            }

            let content = message.message
            if (content.type == "taskTaken"){
		    return resolve(200);
	    }
	    if (content.type == "pong"){
                doRequest(reqcontent,(response)=>{
                    if (response == null) return resolve(500);
                    console.log(reqcontent.id,response.data.length)
                    sendMessage(socket,message.from,message.to,
                                            {type:"response",
                                            response:{
                                                status:response.status,
                                                data:response.data,
                                                headers:response.headers
                                            },
                                            eventid:reqcontent.id,
                                            pubkey:Keypub,
                                            identifer:reqcontent.identifer});
                    return resolve(200);
                })
            }
        } //action message

    })//Promise
}
export async function recvRquest(data) {
    let content = JSON.parse(data.content) 

    if (content.status == 'done'){
        return 
    }

    content['id'] = data.id
    content['identifer'] = data.tags[0][1]
    return new Promise((resolve, reject) => { 
        if (content['Bridge'] && content['clientId']){ 
		connectBridge(content['Bridge'],async (socket,message)=>{
                      
                      let code = await handle_recv_message(socket,message,content);
                      if (code == 200){
                        socket.close();
                        return resolve('recv done');
                      }
                      if (code == 404 || code == 502){
                        socket.close();
                        return resolve('target offline');
                      }
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
