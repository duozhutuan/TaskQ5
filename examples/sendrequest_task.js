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

function handler_task(task_content){
    return new Promise((resolve, reject) => {
        let server="ws://localhost:8081/"
        let socket = new WebSocket(server);


        socket.onmessage = (message) => {
            message = message.data
            message = JSON.parse(message);
            if (message.type=='response'){
                let response = message.response;
                console.log(response.data.length,response.status)
                socket.close()
                resolve(response)
            }
        };

        socket.onopen = () => {
            console.log("connect ok,send a new task")
            socket.send(JSON.stringify(req_task_content))
        }
        socket.onerror = (error) => {
            reject(error);  // 在错误时拒绝 Promise
        };

    })
}

(async () => {
    let response = await handler_task(req_task_content)
    console.log(response.data.length)
})()

