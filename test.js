const { Account, Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptosClient = new Aptos(aptosConfig);

// Define the address of the token owner and the token name
const tokenOwnerAddress = '0x20ea16bbf99f1258b99bbb6e63eacb123597d8fc37a6cb52ea3c6e936ed8ff34';
const colAddress = "29d55ef46b6fa1a08afb4605fd50e6f6c2e7e6c7333f4bbc5a32b2dbff915285";

async function logOwnedTokens() {

    //find the collection_id to use
    try {
            const tokensArray = await aptosClient.getAccountOwnedTokens({
            accountAddress: tokenOwnerAddress
        });
        for (let i = 0; i < tokensArray.length; i++) {
            console.log("collection_id "+tokensArray[i].current_token_data.collection_id);
        }

        
    } catch (error) {
        console.error('Error fetching tokens:', error);
  }
    
    //echo out all the stats and image url
    try {
        const tokensArray = await aptosClient.getAccountOwnedTokensFromCollectionAddress({
        accountAddress: tokenOwnerAddress,
        collectionAddress: colAddress,
    });

    //find info of a specific token
    const legend1 = tokensArray.find(item => item.current_token_data.token_name === 'Legend #3');
    console.log("Legend 3 "+legend1.current_token_data.token_name);
    console.log("Legend 3 "+legend1.current_token_data.token_properties.attack);

    // Loop through each token object in the array
        for (let i = 0; i < tokensArray.length; i++) {
            const tokenObject = tokensArray[i];
            console.log(tokenObject.current_token_data.token_name);
            jsonUrl = tokenObject.current_token_data.token_uri;
        
            // Log the token properties for each token object
            console.log(`Attack :`, tokenObject.current_token_data.token_properties.attack);
            console.log(`Defense :`, tokenObject.current_token_data.token_properties.defense);
            console.log(`Health :`, tokenObject.current_token_data.token_properties.health);

            getImageUrlFromJson(jsonUrl).then(imageUrl => {
                if (imageUrl) {
                console.log('Image URL:', imageUrl);
                // Do something with the image URL here
                } else {
                console.log('Image URL not found in the JSON data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        }
          } catch (error) {
            console.error('Error fetching tokens:', error);
          }

   // Function to fetch and process the JSON file
    async function getImageUrlFromJson(jsonUrl) {
        try {
        // Fetch the JSON file
        const response = await fetch(jsonUrl);
        
        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON data
        const data = await response.json();
        
        // Assuming the image URL is stored in a property called 'imageUrl'
        // Adjust this based on the actual structure of your JSON
        const imageUrl = data.image;
        
        // Return the image URL
        return imageUrl;
        } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        }
    }

   
  }
  
  logOwnedTokens();


  async function getTokenDetails(transactionVersion) {
    const baseUrl = 'https://fullnode.testnet.aptoslabs.com/v1';
    const transactionEndpoint = `/transactions/by_version/${transactionVersion}`;
  
    try {
      const response = await fetch(baseUrl + transactionEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const transactionData = await response.json();
  
      // Assuming the token minting event is the first event in the transaction
      // You might need to adjust this logic based on the actual transaction structure
      const tokenMintEvent = transactionData.events.find(event => event.type === '0x3::token::CreateTokenDataEvent');
      const nftName = tokenMintEvent.data.name;
      if (tokenMintEvent) {
        //we need the name of the token in order to get the token attack/defense values
        //e.g. Legend #1
        console.log('Token Mint Event:', nftName);
      } else {
        console.log('No token mint event found in this transaction.');
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  }
  
  // Call the function with your transaction version
  getTokenDetails(5432892572);
  