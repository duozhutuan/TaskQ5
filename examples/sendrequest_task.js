import WebSocket from 'ws';



let req_task_content = {
    'type':'requests',
    'url':'https://www.google.com',
    'headers' : {'Host':'www.google.com',
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                'Referer': 'https://www.google.com',
            },
    'Bridge':'wss://bridge.duozhutuan.com',
    'clientId':''
}

let server="ws://localhost:8088/"
let socket = new WebSocket(server);


socket.onmessage = (message) => {
    message = message.data
    message = JSON.parse(message);
    if (message.type=='response' && message.status == '200'){
        console.log("taskFinisher:",message.taskFinisher,message.data.length)
    }
};

socket.onopen = () => {
    console.log("connect ok,send a new task")
    socket.send(JSON.stringify(req_task_content))
}
