# taskq5
TaskQ5 is a task distribution platform where you can post tasks if you need help. Many people will join and assist you in completing the task.

# Creator's public key
npub1hn8n8kr86taskq5s22t7lkxunmdt4ejhvg2tnmcvvd4tjjms2cjsxaeqph


# Why TaskQ5? 
Because the public key is integrated within TaskQ5.

# TaskQ5: A Distributed Task Distribution System Using Nostr
TaskQ5 is a distributed multi-task system based on the Nostr protocol, using channels for task publishing and distribution. When users publish tasks like file transfers or web acceleration downloads, we leverage the NostrBridge bridge to facilitate data transfer. This approach allows multiple Nostr clients to exchange data directly, avoiding the use of Relay servers and reducing the need for temporary storage. 

# install
```
npm install
```

# start 
``` 
# wait a new task and start local server
node src/taskcenter.js
``` 

send a new task （javascript）
``` bash
node examples/sendrequest_task.js
```

send a new task （python3）
``` bash
pip3 install websocket-client --break-system-packages
python3 examples/sendrequest_task.py
```
Note: **send task** need start taskcenter.js



### request format
```
let req_task_content = {
    'type':'requests',
    'url':'https://www.google.com', 
    'headers' : {....
            },
    'Bridge':'wss://bridge.duozhutuan.com',
    'clientId':'' //Automatic filling by the system
}

```

url: You need the access URL.
header: Customize your own header.

**Process Flow:**
<img src="https://raw.githubusercontent.com/duozhutuan/taskq5/master/docs/taskq5.drawio.png" alt="drawing" />

1. **PC A** sends a task to the **relays** server.
2. **PC B** subscribes to the channel and retrieves the task sent by **PC A**.
3. **PC B** sends the result to the **bridge server**.
4. The **bridge server** forwards the result to **PC A**.

**Note:** The task from **PC A** includes **PC A**'s ID on the bridge, allowing the bridge server to forward the result from **PC B** to **PC A**. The bridge server does not store any content; it only forwards messages.



