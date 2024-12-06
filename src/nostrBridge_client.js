import WebSocket from 'ws';
import {log} from './log.js'

export function connectBridge(url,onmessage){

    
    let socket = new WebSocket(url);

    // 连接成功时
    socket.onopen = () => {
        log.cyan('recv a task from relay server, connected to Bridge server execute task');
    };

    // 监听从服务器返回的消息
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        onmessage(socket,message)
    };

    socket.onclose = () =>{
    
    };
    socket.onerror =() =>{
	    //console.log("Bridge server close or exit?");
	
    }
    return socket;
}


// 发送消息到另一个客户端
export function sendMessage(socket,to,from,message) {
    const messageData = {
        action: 'message',
        code: 200,
        from: from,  
        to: to,                   
        message: message
    };
    socket.send(JSON.stringify(messageData));
}


