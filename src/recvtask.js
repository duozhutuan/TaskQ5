import { useWebSocketImplementation } from 'nostr-tools/pool';
import WebSocket from "ws"
useWebSocketImplementation(WebSocket);

import { SimplePool } from 'nostr-tools/pool'
import { finalizeEvent } from 'nostr-tools/pure'
import {channel_info,relays,relayServer} from './config.js'
import {        Keypub,
        Keypriv,
        bech32PrivateKey,
        bech32PublicKey} from './getkey.js'


const pool = new SimplePool()



let kind    = 42


export async function recv_task(eventid ) {
    let taskevent = {"kinds":[42],"#e":[eventid],"limit":30}

    let tasks = await pool.querySync(relays,taskevent)

    return tasks;

}

