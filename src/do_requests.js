import axios from 'axios'
import {connectBridge,sendMessage} from './nostrBridge_client.js'
import {send_task,update_task} from './sendtask.js'
import {Keypub} from './getkey.js'
import {log} from './log.js'

export function doRequest(content,callback) {
       log.blue(content.url )
       if (typeof content.headers === 'string') {    
            content.headers = JSON.parse(content.headers);
       }
       axios.get(content.url,{headers:content.headers,responseType: 'arraybuffer'})
        .then(response=>{
            const contentType = response.headers['content-type'];
            let charset = 'utf-8'; 
            const matches = contentType.match(/charset=([^;]+)/);
            if (matches && matches[1]) {
                        charset = matches[1].toLowerCase();
                }
            const decoder = new TextDecoder(charset);
            const text = decoder.decode(new Uint8Array(response.data));
            response.headers['content-length'] = text.length
            response.data = text
            callback(response)
        })
        .catch(error => {
            console.log(error)
            callback(null);
        });
}

//bridge message
async function handle_send_message(socket,message,req_task,finishTask,progressValue){
	console.log("progressValue",progressValue.val,progressValue.status)

        if (message.action == "clientId" ){
            req_task["clientId"] = message.content
            console.log("clientId:",message.content)
            let taskevent = await send_task (JSON.stringify(req_task));
        }
        if (message.action == 'message'){
            let content = message.message
            if (content.type == 'ping'){
                //swap from,to
		if (progressValue.status == 0 || progressValue.val < 3 ){
                	sendMessage(socket,message.from,message.to,{type:'pong'})
			progressValue.status = 1;
			progressValue.val ++ ;
		} else {
			sendMessage(socket,message.from,message.to,{type:'taskTaken'})
		}
            }

            if (content.type == 'response'){
		progressValue.status = 2;    
                console.log("Done EventId: ", content.eventid)
                update_task(req_task,content.eventid,content.identifer,content.pubkey)
                finishTask(content);
                socket.close();
            }
        } 
}


export function sendRequest(req_task,finishTask){
    let progressValue = {val:0,status:0}
    connectBridge(req_task['Bridge'],(socket,message)=>{
           handle_send_message(socket,message,req_task,finishTask,progressValue);
    });
}



//bridge message 

function handle_recv_message(socket,message,reqcontent){

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
                    log.yellow(reqcontent.id,response.data.length)
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
