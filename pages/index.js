import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import axios from "axios";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  useWallet, AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AnyAptosWallet,
  AptosPrivacyPolicy,
  WalletItem,
  groupAndSortWallets,
  isAptosConnectWallet,
  isInstallRequired,
  truncateAddress,
} from '@aptos-labs/wallet-adapter-react';
import ConnectWalletButton from '../helpers/Aptos/ConnectWalletButton';
import QuantityToggle from '../helpers/QuantityToggle';
import { collectionCoverUrl, collectionBackgroundUrl, MaxMint, NODE_URL, CONTRACT_ADDRESS, COLLECTION_SIZE, COLLECTION_ID, SERVICE_NAME } from "../helpers/candyMachineInfo"
import Modal from 'react-bootstrap/Modal';
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BattleButton from '../components/BattleButton';
import { GiSwordClash } from 'react-icons/gi';
import Offcanvas from 'react-bootstrap/Offcanvas';
import CustomDialog from '../components/CustomDialog';


const NETWORK_STR = Network.TESTNET; //refer to network here https://aptos-labs.github.io/aptos-ts-sdk/@aptos-labs/ts-sdk-1.19.0/enums/Network.html

const config = new AptosConfig({ network: NETWORK_STR });
const aptosClient = new Aptos(config);

//const aptosClient = new AptosClient(NODE_URL); //deprecated
const autoCmRefresh = 10000;

export default function Home() {
  //const wallet = useWallet();
  const wallet = useWallet();
  const account = useWallet();
  const { signAndSubmitTransaction } = useWallet();
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false)
  const [currentSupply, setCurrentSupply] = useState();
  const [maxSupply, setMaxSupply] = useState();
  const [canMint, setCanMint] = useState(false)
  const [expireTime, setExpireTime] = useState();
  const [mintFee, setMintFee] = useState();
  const [isWhitelistOnly, setIsWhitelistOnly] = useState();
  const [collectionName, setColectionName] = useState();
  const [whiteList, setWhitelist] = useState([]);
  const [notificationActive, setNotificationActive] = useState(false);
  const [isWhitelist, setIsWhitelist] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingImgUrls, setLoadingImgUrls] = useState(true)

  const [selectedNftNumber, setSelectedNftNumber] = useState(null)
  const [selectedNftImage, setSelectedNftImage] = useState(null)
  const [selectedNftJsonData, setSelectedNftJsonData] = useState(null)
  const [loadingSelfStats, setLoadingSelfStats] = useState(true)
  const [battleDialogState, setBattleDialogState] = useState(false)
  const [gameOverDialogState, setGameOverDialogState] = useState(false)

  const [loadingNpcStats, setLoadingNpcStats] = useState(true)

  useEffect(() => {
    setInterval(() => {
      if (!battleDialogState) {
        document.body.style.overflow = "auto !important"
      }
    }, 100)
  }, [battleDialogState])

  const closeDialog = () => {
    if (!loadingSelfStats && !loadingNpcStats && !battling) {
      setBattleDialogState(false)
    }
  }  

  const initiateBattle = async (_nftImage) => {
    if (_nftImage) {
      setBattleDialogState(true)

      setLoadingSelfStats(true);
      setSelectedNftImage(_nftImage);

      // Extract the number from the URL
      let number = _nftImage.match(/\/image\/(\d+)\.jpg/)[1];
      setSelectedNftNumber(number);

      let jsonResponse = await axios.get(`${_nftImage.split("/image")[0]}/json/${number}.json`);
      setSelectedNftJsonData(jsonResponse.data);
      setLoadingSelfStats(false);

      loadNpcStats()
    }
  }

  const [npcAp, setNpcAp] = useState(null)
  const [npcDp, setNpcDp] = useState(null)
  const [npcText, setNpcText] = useState("")
  const [battling, setBattling] = useState(false)
  const [gameMessage, setGameMessage] = useState("")

  const npcPrependTexts = [
    "BNB Chain", "Polygon", "TRON", "Avalanche", "EOS", "Fantom", "Base", "Solana",
    "WAX", "Cronos", "Tezos", "Linea", "Kujira", "Waves", "Terra", "Wanchain", "Chiliz",
    "Radix", "NEO", "Astar", "VeChain", "Boba", "Hyperliquid", "Scroll", "Thundercore",
    "Blast", "Secret", "Oraichain", "Kadena", "Iota", "Venom", "Aurora", "Klaytn",
    "Moonbeam", "NEAR", "Kava", "Cosmos", "Sei", "Celo", "EOS", "TON", "Steem", "Hive",
    "Cardano", "Ontology", "Flow", "Oasys", "Ziliqa", "Algorand", "XRP", "ZetaChain",
    "Telos", "Hedera", "Ronin", "Sui", "Stellar"
  ];

  const loadNpcStats = () => {
    setLoadingNpcStats(true);

    setTimeout(() => {

      // Select a random prepend value
      const randomPrepend = npcPrependTexts[Math.floor(Math.random() * npcPrependTexts.length)];
      setNpcText(`${randomPrepend} Maxi`);

      // Assign random values from 1 to 9 to ap and dp for npc
      const randomAp = Math.floor(Math.random() * 9) + 1;
      const randomDp = Math.floor(Math.random() * 9) + 1;

      setNpcAp(randomAp);
      setNpcDp(randomDp);

      setLoadingNpcStats(false);
    }, 3000)
  }


  //to connect wallet
  useEffect(() => {
    if (!wallet.autoConnect && wallet.wallet?.adapter) {
      wallet.connect();

    }
  }, [wallet.autoConnect, wallet.wallet, wallet.connect]);

  // to disable if wallet is not connected
  useEffect(() => {
    setNotificationActive(false);

    setCanMint(true);
    setMinting(false);
    setIsWhitelist(false);
    getCandyMachineResourceData();
    if (wallet.connected) {
      logOwnedTokens();

      if (isWhitelistOnly) {
        if (!whiteList.includes(account_address)) {
          setIsWhitelist(false);
          toast.error("Unable to mint as your address is not in the whitelist.");
        } else {
          setIsWhitelist(true)
        }
      }
    }
  }, [wallet])

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  async function logOwnedTokens() {
    try {
      setLoadingImgUrls(true)

      const tokensArray = await aptosClient.getAccountOwnedTokensFromCollectionAddress({
        accountAddress: account_address,
        collectionAddress: COLLECTION_ID,
      });

      const tokenDataArray = [];

      for (let i = 0; i < tokensArray.length; i++) {
        const tokenObject = tokensArray[i];
        const jsonUrl = tokenObject.current_token_data.token_uri;
        const healthPoints = tokenObject.current_token_data.token_properties.health;

        const imageUrl = await getImageUrlFromJson(jsonUrl);
        if (imageUrl) {
          tokenDataArray.push({ imageUrl, healthPoints });
        }
      }


      setImageUrls(tokenDataArray);
      setLoadingImgUrls(false)
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }


  async function getImageUrlFromJson(jsonUrl) {
    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.image;
    } catch (error) {
      console.error('Error fetching or parsing JSON:', error);
    }
  }


  //need when user click mint button and to wait for loading
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  const account_address = wallet.account?.address?.toString();

  const mint = async () => {
    console.log("account_address ::" + account_address);
    if (account_address === undefined) {
      setNotificationActive(current => !current);
      await timeout(3000);
      setNotificationActive(current => !current);
      console.log("account_address undefined");
    }

    const quantitySpan = document.getElementById('quantityField');
    if (!quantitySpan) {
      console.error('Quantity span element not found');
      return;
    }

    const quantity = parseInt(quantitySpan.textContent, 10);
    if (isNaN(quantity)) {
      console.error('Invalid quantity value');
      return;
    }

    let txInfo;
    try {
      console.log("setMinting before");
      setMinting(true);
      // const txHash = await wallet.signAndSubmitTransaction({
      //   sender: account_address,
      //   data: {
      //     function: `${CONTRACT_ADDRESS}::minting::mint_nft`,
      //     typeArguments: [],
      //     functionArguments: [quantity],
      //   },    
      // });
      // console.log("txHash ::", txHash.hash); 

      const txHash = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::minting::mint_nft`,
          typeArguments: [],
          functionArguments: [quantity],
        },
      });

      await aptosClient
        .waitForTransaction({
          transactionHash: txHash.hash
        })
        .then(async () => {
          // setMinting(false);
          getCandyMachineResourceData();
          console.log("setMinting after");

          await getTransactionVersion(txHash.hash)
            .then(async (txversion) => {
              //use the txversion to get attack defence points and also the nftID to generate
              console.log("txversion: " + txversion);

              toast.success(
                <div>
                  <strong>Minting Success!</strong>
                  <a href={`https://explorer.aptoslabs.com/txn/${txHash.hash}?network=${NETWORK_STR}`} target="_blank" rel="noopener noreferrer">
                    <p>View Transaction</p>
                  </a>
                </div>
              );

              setMinting(false);

              document.getElementById("nftList")?.scrollIntoView({ behavior: "smooth" })

              await logOwnedTokens()
            });
        });

      //const txVersion = getTransactionVersion(txHash.hash).catch(console.error);



      // setMinting(false);
      // getCandyMachineResourceData();
      // toast.success(
      //   <div>
      //     <strong>Minting Success!</strong>
      //     <a href={`https://explorer.aptoslabs.com/txn/${txHash.hash}?network=${NETWORK_STR}`} target="_blank" rel="noopener noreferrer">
      //     <p>View Transaction</p>
      //     </a>
      //   </div>
      // );

    } catch (err) {
      txInfo = {
        success: false,
        vm_status: err.message,
      }
      setMinting(false);
      console.log("setMinting error" + err);
    }

  }

  const battle = async () => {
    setBattling(true)
    setGameMessage("")
    console.log("account_address ::" + account_address);

    const ap = parseInt(selectedNftJsonData?.attributes[0]?.value); //set this to the nft attack point
    const dp = parseInt(selectedNftJsonData?.attributes[1]?.value); //set this to the nft defense point
    const npcap = npcAp; //set this to the npc attack point
    const npcdp = npcDp; //set this to the npc defense point

    console.log({ ap, dp, npcap, npcdp });

    let txInfo;
    try {
      console.log("battle before");

      const txHash = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::minting::battle`,
          typeArguments: [],
          functionArguments: [ap, dp, npcap, npcdp],
        },
      });
      const transactionResponse = await aptosClient
        .waitForTransaction({
          transactionHash: txHash.hash
        })
        .then(() => {
          console.log("battle after");

          toast.success(
            <div>
              <strong>Battle Results!</strong>
              <a href={`https://explorer.aptoslabs.com/txn/${txHash.hash}?network=${NETWORK_STR}`} target="_blank" rel="noopener noreferrer">
                <p>View Transaction</p>
              </a>
            </div>
          );

        })
        .catch(err => {
          console.log(err);
          setBattling(false)
        })

      await getTransactionWhoWon(txHash.hash)
        .then((txversion) => {
          //use the txversion to get attack defence points and also the nftID to generate
          console.log("getTransactionWhoWon: " + txversion);
          setBattling(false)
        });

    } catch (err) {
      txInfo = {
        success: false,
        vm_status: err.message,
      }
      console.log("battle error" + err);
      setBattling(false)
    }

  }

  async function getTransactionWhoWon(txHash) {
    try {
      const transactionEndpoint = "https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/" + txHash;
      const response = await fetch(transactionEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const transactionData = await response.json();

      //e.g data https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/0x25f63969aa405b34600f1f8d2d75734152dd284f7153b50f7b65766b65ce82ef
      //get winner - if 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff - mean lose
      let winner = null;

      // Iterate through events array
      for (const event of transactionData.events) {
        if (event.type === `${CONTRACT_ADDRESS}::minting::BattleEvent`) {
          winner = event.data.winner;
          console.log("winner:: " + winner);
          if (winner === "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") {
            //npc wins (player loses)
            setGameOverDialogState(true)
            setGameMessage("NPC Won!")
          }
          else {
            // npc loses (player wins)
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/generateDominatedImage`, { caption: npcText })
            setGameOverDialogState(true)
            setGameMessage("Congratulations! You won!")
          }
          break; // Exit the loop once the desired event is found
        }
      }

      // Extract the transaction version from the response
      const transactionVersion = transactionData.version;
      //console.log(`Transaction version: ${transactionVersion}`);
      return transactionVersion;
    } catch (error) {
      console.error('Error fetching transaction version:', error);
    }
  }

  async function getTransactionVersion(txHash) {
    try {
      const transactionEndpoint = "https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/" + txHash;
      const response = await fetch(transactionEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const transactionData = await response.json();

      //e.g data https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/0x25f63969aa405b34600f1f8d2d75734152dd284f7153b50f7b65766b65ce82ef
      //we need to get the Legend #(number) and also the Attack Point, Defense Points
      let name = null;
      let property_values = null;

      // Iterate through events array
      for (const event of transactionData.events) {
        if (event.type === "0x3::token::CreateTokenDataEvent") {
          name = event.data.name;
          property_values = event.data.property_values;
          break; // Exit the loop once the desired event is found
        }
      }

      const nftNumber = getValueAfterHash(name);
      console.log("Token Number:: " + nftNumber);
      console.log("Token property_values:: " + property_values);
      const properyValues = splitByComma(String(property_values));

      let attackValue = parseInt(properyValues[0], 16);
      console.log("attackValue::" + attackValue + " -- " + properyValues[0]);

      const defenseValue = parseInt(properyValues[1], 16);
      console.log("defenseValue::" + defenseValue + " -- " + properyValues[1]);

      const healthValue = parseInt(properyValues[2], 16);
      console.log("healthValue::" + healthValue + " -- " + properyValues[2]);

      //generateNFTimage and json
      //nftNumber , attackValue, defenseValue
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/generateNFTImageAndJson`, { nftNumber, attackValue, defenseValue, healthValue })
        .then(async () => {
          // Extract the transaction version from the response
          const transactionVersion = transactionData.version;

          //console.log(`Transaction version: ${transactionVersion}`);
          return transactionVersion;
        })
        .catch(err => {
          throw err
        })


    } catch (error) {
      console.error('Error fetching transaction version:', error);
    }
  }

  function splitByComma(str) {
    // Split the string by the ',' character
    return str.split(',');
  }

  function getValueAfterHash(str) {
    // Split the string by the '#' character
    const parts = str.split('#');
    // Check if there's at least one part after the split
    if (parts.length > 1) {
      // Return the value after the '#'
      return parts[1].trim();
    } else {
      // Return null if '#' is not found
      return null;
    }
  }

  async function getCandyMachineResourceData() {
    const response = await axios.get(`${NODE_URL}/accounts/${CONTRACT_ADDRESS}/resources`);
    console.log(response);
    const resources = response.data;
    console.log(response.data);

    for (const resource of resources) {
      if (resource.type === `${CONTRACT_ADDRESS}::minting::ModuleData`) {
        setExpireTime(resource.data.expiration_timestamp);
        setCurrentSupply(resource.data.current_supply);
        setMaxSupply(resource.data.maximum_supply);
        setColectionName(resource.data.collection_name);
        setWhitelist(resource.data.whitelist_addr);
        setIsWhitelistOnly(resource.data.whitelist_only);


        if (wallet.account?.publicKey?.toString() == resource.data.public_key.bytes) {
          setCanMint(!canMint)
          console.log("this is admin")
        }
        if (resource.data.presale_status == false && resource.data.publicsale_status == false) {
          setMinting(false);
          setCanMint(!canMint)
        }
        if (resource.data.presale_status && resource.data.publicsale_status) {
          setMintFee(resource.data.public_price)
        }
        else if (resource.data.presale_status == true) {
          setMintFee(resource.data.per_sale_price)
        } else {
          setMintFee(resource.data.public_price)
        }
      }
    }

  }

  //calculate time
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  function convertMsToTime(timestamp) {
    console.log("Timestamp ::" + timestamp);
    // Create a Date object from the Unix timestamp (multiply by 1000 to convert seconds to milliseconds)
    const date = new Date(timestamp * 1000);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Determine AM/PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');

    // Construct the final formatted date and time string
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className="bg-gray-500">
      <div className={styles.container}>
        <Head>
          <title>Aptos Legends</title>
          <meta name="description" content="Aptos Legends" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" crossOrigin="anonymous" />
        </Head>
        <img
          src={collectionBackgroundUrl}
          alt={'background'}
          className={styles.bg_image}
        />
        <div
          className={styles.bg_filter}
        ></div>

        <main className={styles.main}>
          <h1 className={styles.title}>
            {collectionName}
          </h1>
          <div className={styles.topcorner}>
            <ConnectWalletButton connectButton={!wallet.connected} className="d-flex" />
          </div>
          <div id="header" style={{ fontWeight: "bold", fontSize: "20px",marginBottom: "20px", color: "white", textAlign: "center" }}>
            Mint an AI-infused meme NFT and battle wojak!
          </div>
          <img src={collectionCoverUrl} className={styles.mintimage} />

          <div id="collection-info" className="d-flex flex-column align-items-center text-white" style={{ width: "80%" }}>
            <QuantityToggle onChange={handleQuantityChange} />

            {(isWhitelistOnly && isWhitelist) || !isWhitelist ? <div className="d-flex align-items-center my-3">

              <button className={styles.button} onClick={mint} disabled={!canMint}>{minting ? <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> : "Mint"}</button>

            </div> : <br />}

            <div className={styles.mintstats}>

              {(isWhitelistOnly && isWhitelist) || !isWhitelist ?
                <div className={styles.spacebetween}>
                  <h6>Mint fee: </h6>
                  <h6 id="mintfee">{mintFee / 100000000} APT</h6>
                </div> : ''}

              <div className={styles.spacebetween}>
                <h6>Current Supply: </h6>
                <h6>{currentSupply ? currentSupply : '0'}</h6>
              </div>

              <div className={styles.spacebetween}>
                <h6>Maximum Supply: </h6>
                <h6>{maxSupply}</h6>
              </div>

              <div className={styles.spacebetween}>
                <h6>Mint Deadline: </h6>
                <h6>{convertMsToTime(expireTime)}</h6>
              </div>

            </div>
            <div className={`${styles.notification} ${notificationActive ? styles.visible : styles.hidden}`}>
              <h6 className={styles.notificationtext}>Please connect your wallet at the top right of the page</h6>
            </div>

            {/* <button className={styles.button} onClick={battle} >Sample Battle</button> */}
          </div>

        </main>

        <div id="header" style={{ fontWeight: "bold", fontSize: "40px", color: "white", textAlign: "center" }}>
            Your NFTs
          </div>
        
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          
          {wallet.connected
            &&
            <div id="nftList" style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              {loadingImgUrls
                ?
                <p className={styles.title_white}>Loading your NFTs <Spinner animation="border" role="status" className='mx-3'><span className="visually-hidden">Loading...</span></Spinner></p>

                :
                <div className={styles.nft_container}>
                  {
                    imageUrls.map((tokenData, index) => (
                      <div key={index} className={styles.nft}>
                        <img
                          src={tokenData.imageUrl}
                          alt={`Token ${index}`}
                          className={styles.nft_img}
                        />
                        <button className={styles.battle_button} onClick={() => { initiateBattle(tokenData.imageUrl) }}><GiSwordClash /> Enter Battle</button>


                      </div>
                    ))}

                  <CustomDialog
                    show={battleDialogState}
                    closeDialog={closeDialog}
                    dialogContent={
                      <>
                        <Modal.Header style={{ borderColor: "#222" }}>
                          <Modal.Title><GiSwordClash style={{ fontSize: "2rem" }} /></Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                          <h2 className='text-center'>Battle Mode</h2>
                          <div className='d-flex align-items-center h-100' style={{ width: "100%" }}>
                            <div>
                              <div className='my-5 d-flex justify-content-center align-items-center gap-5 mt-5 pt-5'>
                                {loadingSelfStats
                                  ? "loading"
                                  :
                                  <div className={`${styles.battle_nft} ${styles.my_nft}`}>
                                    <img src={selectedNftImage} className={styles.nft_img} />
                                    <div className='mt-3'>
                                      <p className={`${styles.battle_stats} text-center`}>AP: {selectedNftJsonData?.attributes[0]?.value}</p>
                                      <p className={`${styles.battle_stats} text-center`}>DP: {selectedNftJsonData?.attributes[1]?.value}</p>
                                    </div>
                                  </div>
                                }

                                <p className={styles.battle_stats}>v/s</p>

                                {loadingNpcStats
                                  ?
                                  <div className="d-flex justify-content-center align-items-center" style={{ height: "10rem", width: "15rem" }}>
                                    <Spinner animation="border" role="status" className={`mx-3`}><span className="visually-hidden">Loading...</span></Spinner>
                                  </div>

                                  :
                                  <div className={`${styles.battle_nft} ${styles.npc_nft}`}>
                                    <div className={styles.maxi_container}>
                                      <img src="https://i.imgflip.com/2/8x1skt.jpg" className={styles.nft_img} />
                                      <p className={`${styles.maxi_text} text-center`}>{npcText}</p>
                                    </div>
                                    <div className='mt-3'>
                                      <p className={`${styles.battle_stats} text-center`}>AP: {npcAp}</p>
                                      <p className={`${styles.battle_stats} text-center`}>DP: {npcDp}</p>
                                    </div>
                                  </div>
                                }

                              </div>
                              {!loadingSelfStats && !loadingNpcStats
                                &&
                                <div className={`w-100 d-flex justify-content-center mb-5 pb-5`}>
                                  <button className={styles.battle_button} onClick={battle} disabled={battling}>Start Battle {battling && <Spinner size='sm' animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}</button>
                                </div>
                              }
                            </div>
                          </div>
                        </Modal.Body>
                      </>
                    }
                  />

                  <CustomDialog
                    show={gameOverDialogState}
                    closeDialog={() => setGameOverDialogState(false)}
                    dialogContent={
                      <div>
                        <h2>Game Over</h2>
                        <p className={styles.battle_stats}>{gameMessage}</p>
                        <div><button className={`${styles.battle_button} my-5`} onClick={() => { setGameOverDialogState(false); setBattleDialogState(false) }}>Play Again</button></div>
                      </div>
                    }
                  />
                </div>
              }
            </div>
          }
        </div>

      </div>
      <ToastContainer />
    </div>
  )
}
