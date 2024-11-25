
import {sendRequest} from '../src/do_requests.js'

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

// get request content
function savefile(content)
{
    console.log("save file length:" , content.data.length)
}

//connect to bridge server and send task
sendRequest(req_task_content,savefile);

