import { LocalStorage } from 'node-localstorage';
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import * as nip19 from 'nostr-tools/nip19'

const localStorage = new LocalStorage('.data');

//localStorage.removeItem("Keypriv")

export let Keypub;
export let Keypriv = localStorage.getItem('Keypriv');
if (Keypriv === null){
    Keypriv = generateSecretKey() // `sk` is a Uint8Array
    Keypub = getPublicKey(Keypriv) // `pk` is a hex string
    localStorage.setItem('Keypriv', Keypriv);
} else {
    const numArray = Keypriv.split(',').map(Number);
    Keypriv = new Uint8Array(numArray)
    Keypub = getPublicKey(Keypriv) // `pk` is a hex string
}
export const bech32PrivateKey = nip19.nsecEncode(Keypriv);
export const bech32PublicKey = nip19.npubEncode(Keypub);

console.log("Your public key:",bech32PublicKey)

