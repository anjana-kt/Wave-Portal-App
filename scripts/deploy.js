const main = async()=>{
    // The section below is not necessary
    //*******************************
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance =  await deployer.getBalance();

    console.log("Account from which contract is deployed (Deployers account) : ",deployer.address);
    console.log("Balance in the deployers account : ",hre.ethers.utils.formatEther(accountBalance));
    //********************************
    const wavePortalFactory =  await hre.ethers.getContractFactory("WavePortal");
    
    const  wavePortal = await wavePortalFactory.deploy({value : hre.ethers.utils.parseEther("0.01")});
    await wavePortal.deployed();

    console.log("Wave Portal deployed to contract address : ",wavePortal.address);
}
const runMain = async()=>{
    try{
        await main();
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }

}
runMain();