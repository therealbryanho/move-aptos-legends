export const collectionName = "Aptos Legends"; // Case sensitive!
export const MaxMint = 1;
export const COLLECTION_SIZE = 1000000;

// To remove the background of the dapp to a solid color just delete the "collectionCoverUrl" url below
// Any hosted image can be used - jpeg, gif, png
export const collectionCoverUrl = "https://vlbhndrnwwflmnjachef.supabase.co/storage/v1/object/public/development/collection.jpg";
export const collectionBackgroundUrl =
  "https://img.freepik.com/free-vector/dark-black-background-design-with-stripes_1017-38064.jpg?t=st=1721174484~exp=1721178084~hmac=8285798c783503f528c397a8559437ef690d9e012c44bd1207cef9e09bef6eb2&w=2000";

export const mode = "test"; // "dev" or "test" or "mainnet"
export let NODE_URL;
export const CONTRACT_ADDRESS =
  "0xe2b285652d01d6e8759d9237ce178c8bd133633c5940426c3f940d618dfd1b13";
  export const COLLECTION_ID =
  "807517225962f30cea6f67597242279aeb5196483a8a8d51468f74545bb2f129";
let FAUCET_URL;

if (mode == "dev") {
  NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
  FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
} else if (mode === "test") {
  NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
  FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
} else {
  NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
  FAUCET_URL = null;
}
