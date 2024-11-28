import websocket 
import json

server="ws://localhost:8088/"
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




def on_message(ws, message):
    message = json.loads(message)
    if (message['type']=='response' and message['status'] == '200'):
      print("taskFinisher:",message['taskFinisher'],len(message['data']))

def on_open(ws):
    print("connect ok,send a new task")
    ws.send(json.dumps(req_task_content))


if __name__ == "__main__":
    ws = websocket.WebSocketApp(server,
                                on_open=on_open,
                                on_message=on_message
                                )

    ws.run_forever()

