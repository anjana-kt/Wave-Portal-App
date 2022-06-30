// only to be deployed in localhost since currently network don't provide 2 signers account
const main = async ()=> {
    // get signers just returns a list of accounts and we are asigning first one as owner
    const [owner, randomPerson] = await hre.ethers.getSigners();

    // get the contract from developers factory
    const WavePortalFactory = await hre.ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortalFactory.deploy({value: hre.ethers.utils.parseEther("0.01")});

    // wait until contract deployed
    await wavePortal.deployed();

    // this value changes in each deployment onl remains constant in a real blockchain
    // this is the contract address
    const wavePortalAdress = wavePortal.address;

    console.log("Wave Portal contract address is : ", wavePortalAdress);
    console.log("OR \nWave Portal deployed to : ", wavePortalAdress);
    console.log("\nContract deployed by owner : %s", owner.address);

    // To get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(wavePortalAdress);
    console.log("Contract balance: ",hre.ethers.utils.formatEther(contractBalance));

    let waveCount;
    waveCount = await wavePortal.getTotalWaves();

    await wavePortal.wave("A message 4 u !",{gasLimit : 0.01}); 

    await wavePortal.connect(randomPerson).wave("Another message 4 u !",{gasLimit : 0.01});
    
    // To get contract balance
    contractBalance = await hre.ethers.provider.getBalance(wavePortalAdress);
    console.log("Contract balance: ",hre.ethers.utils.formatEther(contractBalance));

    waveCount = await wavePortal.getTotalWaves();

    let allWaves = await wavePortal.getAllWaves();
    console.log(allWaves);
}
// main();
const runMain = async()=>{
    try{
        await main();
        // exit with success
        process.exit(0);
    }
    catch (error){
        console.log(error);
        // error exit
        process.exit(1);
    }
}

// without exporting any function its not gonna run, it will just be compiled.
// even if it's a main function!!
runMain();