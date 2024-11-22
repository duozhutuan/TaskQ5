import WebSocket from 'ws';

let connects = {}

export function connectBridge(url,onmessage){

    
    let socket;
    if (connects[url]){
        socket = connects[url];
    } else {
        socket = new WebSocket(url);
    }

    // 连接成功时
    socket.onopen = () => {
        console.log('Connected to WebSocket server');
        connects[url] = socket;
    };

    // 监听从服务器返回的消息
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        onmessage(socket,message)
    };

    socket.onclose = () =>{
         Object.keys(connects).forEach((pubkey) => {
            if (connects[url] === socket) {
                delete connects[url];
            }
        })
    };

    return socket;
}


// 发送消息到另一个客户端
export function sendMessage(socket,to,from,message) {
    const messageData = {
        action: 'message',
        from: from,  
        to: to,                   
        message: message
    };
    socket.send(JSON.stringify(messageData));
}


