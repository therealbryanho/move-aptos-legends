## Aptos Legends - Aptos Legends - Memes NFT Trading Card Game

Aptos Legends: [https://aptoslegends.netlify.app](https://aptoslegends.netlify.app)

### About Aptos Legends

INTERNET ❤️ MEMES, BUT WE'RE NOT CREATING THEM FAST ENOUGH.

Introducing Aptos Legends: The Ultimate Trading Card Game with AI-Infused Meme NFTs.

Aptos Legends is a revolutionary platform where you can mint AI-generated Meme NFTs and engage in battles with “other blockchain” maxis. Join the fun with our exclusive 1 million NFT collection, currently free minting on the Aptos testnet.

### Our Goal

Bring fun to Aptos community with AI-infused memes and NFT games. 

### Key Features

Generate AI-infused meme NFTs. Meme image powered by Imgflip, AI meme caption powered by Microsoft Azure AI, NFT on blockchain powered by Aptos.

Smart contract is deployed on Aptos testnet. For the frontend, we have integrated Aptos Wallet library that supports Aptos Keyless and Aptos Connect so that users can login via Google and get a wallet.

Where we needed to get data about the transaction, we used the Aptos Node Rest API, this was very helpful for getting immediate feedback and data regarding transactions (like, the randomised on-chain NFT traits - attack and defense points, the result of a NFT battle - all powered by Aptos Randomness).

### Getting Set Up

Pre-requisites

* Ensure you have recent versions of both node and yarn installed.
* Contract code has to be deployed first. Refer to contract repo.
* Account needs to be in whitelist (if minting is only for whitelisted accounts). Refer to contract repo.

### Installation

Step 1)

Clone this repo

Step 2)

Make sure you are located in /aptos-legends and use npm to install dependencies (IMPORTANT - not yarn) 

bash
cd aptos-legends
npm install --force
 
### Run

 to
npm run dev
# or
yarn dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy the Mintsite

This will create a folder "out".

 to
npm run build


The "out" folder can be deployed to any hosting like Netlify.