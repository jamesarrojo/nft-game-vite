import { useEffect, useState } from 'react'
import './App.css'
import SelectCharacter from './components/SelectCharacter';
import Arena from './components/Arena'
import myEpicGame from "./utils/MyEpicGame.json"
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';




function App() {

  // state variable to store user's public wallet
  const [currentAccount, setCurrentAccount] = useState(null);

  // state vriable to store user's character NFT
  const [characterNFT, setCharacterNFT] = useState(null)

  // function that checks if we have metamask
  const checkIfWalletIsConnected = async () => {
    try {

      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return
      } else {
        console.log('We have the ethereum object', ethereum)

        // check if we are authorized to access user's wallet
        const accounts = await ethereum.request({ method: 'eth_accounts' })

        // user's can have multiple accounts, we grab the first one if it's there

        if (accounts.length !== 0) {
          const account = accounts[0]
          console.log("Found an authorized account", account)
          setCurrentAccount(account)
        } else {
          console.log("No authorized account found")
        }
      }
    } catch(error) {
      console.log(error)
    }
  }

  // render methods
  const renderContent = () => {
    // scenario 1
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://www.gifcen.com/wp-content/uploads/2022/06/avengers-assemble-gif-3.gif"
            alt="Avengers Assemble Gif"
          />
          <button
            className='cta-button connect-wallet-button'
            onClick={connectWalletAction}
          >
            Connect Wallet to Get Started
          </button>
        </div>
      )
      // scenario 2
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />

      // If there is a connected wallet and characterNFT, it's time to battle!
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />
    }
  }

  // connect wallet method implementation
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window
      
      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }

      // fancy method to request access to account
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      // this should print out the public address once we authorize metamask
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  // make sure you are connected to the Goerli test network with Metamask
  const checkNetwork = async () => {
    try { 
      if (window.ethereum.networkVersion !== '5') {
        alert("Please connect to Goerli!")
      }
    } catch(error) {
      console.log(error)
    }
  }

  // runs the checkIfWalletIsConnected() when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    /*
     * The function we will call that interacts with our smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      const txn = await gameContract.checkIfUserHasNFT();
      // console.log(txn)
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }
    };
  
    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  useEffect(() => {
    checkNetwork()
  }, [])

  return (
    <div className="App">
       <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        {/* <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div> */}
      </div>
    </div>
  )
}

export default App
