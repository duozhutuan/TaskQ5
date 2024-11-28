import websocket 
import json

req_task_content = {
    'type':'requests',
    'url':'https://www.google.com',
    'headers' : {'Host':'www.google.com',
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                'Referer': 'https://www.google.com',
            },
    'Bridge':'wss://bridge.duozhutuan.com',
    'clientId':''
}


def handle_task(taskcontent,reponse):
    server="ws://localhost:8088/"
    def on_message(ws, message):
        global data;
        message = json.loads(message)
        if (message['type']=='response' and message['status'] == '200'):
            print("taskFinisher:",message['taskFinisher'],len(message['data']))
            reponse['data'] = message['data']
            ws.close()
    def on_open(ws):
        print("connect ok,send a new task")
        ws.send(json.dumps(taskcontent))

    ws = websocket.WebSocketApp(server,
                                on_open=on_open,
                                on_message=on_message
                                )

    ws.run_forever()


if __name__ == "__main__":
    reponse = {}
    handle_task(req_task_content,reponse)
    print(len(reponse['data']))
