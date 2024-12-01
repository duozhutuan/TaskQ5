
import NDK ,{NDKPrivateKeySigner,NDKRelaySet,NDKEvent} from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

import {channel_info,relays,relayServer} from './config.js'
import {        Keypub,
        Keypriv,
        bech32PrivateKey,
        bech32PublicKey} from './getkey.js'



let kind    = 42
let tags    =  [['d',''],['e', channel_info.id, relayServer[0], 'root'],]
const ndk = new NDK({
    explicitRelayUrls: relays,
    devWriteRelayUrls: relays,
    signer:new NDKPrivateKeySigner(Keypriv)
});

await ndk.connect();
let relaySets =  NDKRelaySet.fromRelayUrls(ndk._explicitRelayUrls, ndk);


    setInterval(() => {
        ndk.pool.relays.forEach((relay, key) => {
            relay.connectivity._connectionStats.attempts = 1;
        });
    }, 10000);


export async function send_task(content){

    //add identifer
    let identifer = String(Date.now());
    let tags1 = tags	
    tags1[0][1] = identifer;

    tags1.push(["published_at",identifer ])

	const ndkEvent = new NDKEvent(ndk);
	ndkEvent.kind = kind;
	ndkEvent.content = content;
	ndkEvent.tags = tags1;
	await ndkEvent.sign()
	let ok = await ndkEvent.publish(relaySets,2000,0);
	return ndkEvent
} 
export async function update_task(content,eventid,identifer,pubkey) {


          if (content['status'] != 'done'){
               // update new status
               let Nevent = new NDKEvent(ndk);
               let tags1 = tags	
               tags1[0][1] = identifer;
               tags1.push(["published_at",identifer ])
               content['status'] = 'done';
               content['taskFinisher_pubkey'] = pubkey;
               Nevent.content = JSON.stringify(content);
	           Nevent.kind = kind;
	           Nevent.tags = tags1;
               await Nevent.publish(relaySets,2000,0);

               // delete old task
               let Hevent = new NDKEvent(ndk);
               Hevent.kind = 5
               Hevent.tags = [ ['e',eventid],['k','42'] ]
               Hevent.content = "task done";
               await Hevent.publish(relaySets,2000,0)
         }
}






