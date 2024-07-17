import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/globals.css'
import { PetraWallet } from "petra-plugin-wallet-adapter";
const { Account, Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');

import {
  AptosWalletAdapterProvider, AnyAptosWallet
} from '@aptos-labs/wallet-adapter-react';

function MyApp({ Component, pageProps }) {
  //const wallets = AnyAptosWallet;
  //const wallets = [new PetraWallet()];
  //      plugins={wallets}

  return <AptosWalletAdapterProvider
      optInWallets={["Petra"]}
      autoConnect={true} /** allow auto wallet connection or not **/
      dappConfig={{ network: Network.TESTNET }}
      onError={(error) => {
        console.log('AptosWalletAdapterProvider Error :: ', error);
      }}>
        <Component {...pageProps} />
    </AptosWalletAdapterProvider>
}

export default MyApp
