const main = async ()=> {
    // get the contract from developers factory
    const WavePortalFactory = await hre.ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortalFactory.deploy();

    // wait until contract deployed
    await wavePortal.deployed();

    // this value changes in each deployment onl remains constant in a real blockchain
    // this is the contract address
    const wavePortalAdress = wavePortal.address;

    console.log("Wave Portal contract address is : ", wavePortalAdress);
    console.log("OR \nWave Portal deployed to : ",wavePortalAdress);
    
}

const runMain = async()=>{
    try{
        await main();
        process.exit(0);
    }
    catch (error){
        console.log(error);
        process.exit(1);
    }
}

// without exporting any function its not gonna run, it will just be compiled.
// even if it's a main function!!
runMain();