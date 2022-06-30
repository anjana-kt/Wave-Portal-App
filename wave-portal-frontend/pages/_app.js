import '../styles/app.css'
import React,{useEffect,useState} from "react"
import {ethers} from "ethers"
import abi from "../utils/WavePortal.json"

function MyApp() {

  //create a state variable along with a function to update it
  const [currentAccount, setCurrentAccount] = useState("");
  const [msg, setMessage] = useState("");
  var value;
  var wavePortalContractAddress = '0xb011230a41FC655015bCD05fBFbA518E01d21f7f';
  // wavePortalContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = abi.abi;

  const [allWaves,setAllWaves] = useState([]);

  const wave = async(msg)=>{
    try{
      const {ethereum} = window;
      if(ethereum)
      { 
        const provider = new ethers.providers.Web3Provider(ethereum);
        //var wsProvider = new ethers.providers.WebSocketProvider("wss://eth-rinkeby.alchemyapi.io/v2/BQA73UYbcBv0d8zE_M1pA0npXD5xhFYQ","rinkeby");

        const signer = provider.getSigner();
        console.log("Got signers");
        const wavePortalContract = new ethers.Contract(wavePortalContractAddress,contractABI,signer);
        

        // // Gets total waves
        // console.log("Reading no of waves....");
        // let count = await wavePortalContract.getTotalWaves();
        // console.log("Retreived number of waves : ",count.toNumber());

        // excecute actual wave function
        const waveTxn = await wavePortalContract.wave(msg);
        console.log("Mining...",waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ",waveTxn.hash);

        // //Get total waves
        // count = await wavePortalContract.getTotalWaves();
        // console.log("Retreived number of waves : ",count.toNumber());
      }
      
      else{
        console.log("Ethereum object doesn't exist");
      }
    }
    catch(error)
    {
      console.error(error);
    }
  }

  const getAllWaves = async()=>{
    try{
      if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = new provider.getSigner();
        const wavePortalContract = new ethers.Contract(wavePortalContractAddress,contractABI,signer);

        const waves = await wavePortalContract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach(wave => {wavesCleaned.push({
          address : wave.waver,
          timestamp : new Date(wave.timestamp*1000),
          message: wave.message
        }
        )});
        setAllWaves(wavesCleaned);
      }
      else{
        console.log("Ethereum object doesn't exsists..");
      }
    }
    catch(e){
      console.log(e);
    }
  }


  const connectWallet = async()=>{
    const {ethereum} = window;
    try{  
      if(!ethereum)
      {
        console.log("Get a Metamask");
        return;
      }

      const accounts = await ethereum.request({method:"eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      console.log("Successfully connected wallet!")
    }
    catch(error){
      console.log(error);
    }
    
  }

  const checkWalletConnection = async()=>{
    // If we're logged in to Metamask, window automatically injects a special object named ethereum.
    const {ethereum} = window;

    // Following if-block checks if metamask widget is available or not
    try{
      if (!ethereum){
        console.log("Make sure to have a Metamask! ");
        return;
      }
      else{
        console.log("Metamask object available :) ", ethereum);
      }

      // Following checks if we're authorized to access the user's wallet
      // Sending request via ethereum object to call eth_accounts function
      const accounts = await ethereum.request({method:"eth_accounts"});
      if (accounts.length !=0){
        const account = accounts[0];
        console.log("Found Authorised account : ",account);
        // updating the state variable
        setCurrentAccount(account);
        getAllWaves();
      }
      else{
        console.log("Couldn't find any account");
      }
    }
    catch(error){
      console.log(error);
    }
  } 

  // This runs a function when the page loads.
  useEffect(()=>{
    let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(wavePortalContractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
 };
},[]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Nice to meet you!
        </div>

        <div className="bio">
         Connect your Ethereum wallet and wave at me!
        </div>

        <input id="message" type="text" placeholder=" "/>

        <button className="waveButton" onClick={()=>{
            var message=document.getElementById("message").value;
            wave(message);
          }}>
          Wave
        </button>
         
        {
        //Following means : If there is no currentAccount render this button
        (!currentAccount )&&
          (<button className="connectButton" onClick={connectWallet}>Connect Wallet</button>)
        }
        
        {
          // Here we print the fetched values
          allWaves.map((wave,index)=>{
            return(
              <div key = {index}>
                <ol>
                <li>Adress : {wave.address}</li>
                <li>Message : {wave.message}</li>
                <li>Time : {wave.timestamp.toString()}</li>
                </ol>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default MyApp