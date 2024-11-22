import { useWebSocketImplementation } from 'nostr-tools/pool';
import WebSocket from "ws"
useWebSocketImplementation(WebSocket);

import { SimplePool } from 'nostr-tools/pool'
import { getPublicKey,getEventHash,finalizeEvent } from 'nostr-tools/pure'
import {channel_info,relays,relayServer} from './config.js'
import {        Keypub,
        Keypriv,
        bech32PrivateKey,
        bech32PublicKey} from './getkey.js'

import {sendRequest} from './do_requests.js'

const pool = new SimplePool()


let kind    = 42
let tags    =  [['e', channel_info.id, relayServer[0], 'root'],]

export function update_task(content,eventid) {
    //reply event
    let tags    =  [['e',channel_info.id,relayServer[0],'root'],
                    ['e', eventid, relayServer[0], 'reply'],
                    ['p',Keypub,relayServer[0]]]
    let taskevent = {
                kind,
                tags,
                pubkey: Keypub,
                content,
                created_at: Math.floor(Date.now() / 1000),
                id: '',
                sig: ''
            }
    //add id and sign 
    taskevent = finalizeEvent(taskevent,Keypriv)

    Promise.all(pool.publish(relays, taskevent))
    .then((results) => {
        console.log('All publish results:', results);
    })
    .catch((error) => {
        console.error('Publish failed:', error);
    });
}





export function send_task(content) {
    let taskevent = {
                kind,
                tags,
                pubkey: Keypub,
                content,
                created_at: Math.floor(Date.now() / 1000),
                id: '',
                sig: ''
            }
    //add id and sign 
    taskevent = finalizeEvent(taskevent,Keypriv)

    Promise.all(pool.publish(relays, taskevent))
    .then((results) => {
        console.log('All publish results:', results);
    })
    .catch((error) => {
        console.error('Publish failed:', error);
    });
    return taskevent
}

