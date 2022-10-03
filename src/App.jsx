import { useEffect, useState } from 'react'
import './App.css'




function App() {

  // state variable to store user's public wallet
  const [currentAccount, setCurrentAccount] = useState(null);

  // function that checks if we have metamask
  function checkIfWalletIsConnected() {
  const { ethereum } = window;

  if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }
  }

// runs the checkIfWalletIsConnected() when the page loads
useEffect(() => {
  checkIfWalletIsConnected();
}, [])

  return (
    <div className="App">
       <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
          </div>
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
