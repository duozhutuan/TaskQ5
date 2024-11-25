
import NDK ,{NDKPrivateKeySigner,NDKRelaySet,NDKEvent} from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

import {channel_info,relays,relayServer} from './config.js'
import {        Keypub,
        Keypriv,
        bech32PrivateKey,
        bech32PublicKey} from './getkey.js'



let kind    = 42
let tags    =  [['e', channel_info.id, relayServer[0], 'root'],]
const ndk = new NDK({
    explicitRelayUrls: relays,
    devWriteRelayUrls: relays,
    signer:new NDKPrivateKeySigner(Keypriv)
});

await ndk.connect();
let relaySets =  NDKRelaySet.fromRelayUrls(ndk._explicitRelayUrls, ndk);

export async function send_task(content){
	
	const ndkEvent = new NDKEvent(ndk);
	ndkEvent.kind = kind;
	ndkEvent.content = content;
	ndkEvent.tags = tags;
	await ndkEvent.sign()
	let ok = await ndkEvent.publish(relaySets,2000,0);
	return ndkEvent
} 
export async function update_task(content,eventid) {
    //reply event
    let tags    =  [['e',channel_info.id,relayServer[0],'root'],
                    ['e', eventid, relayServer[0], 'reply'],
                    ['p',Keypub,relayServer[0]]]
    const ndkEvent = new NDKEvent(ndk);
    ndkEvent.kind = kind;
    ndkEvent.content = content;
    ndkEvent.tags = tags;
    let ok = await ndkEvent.publish(relaySets,2000,0);
}






