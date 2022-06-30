require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// This line implements the command : npx hardhat accounts
// task name comes with command, similarly we can make many costum commands
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const alchemyProjectId = "BQA73UYbcBv0d8zE_M1pA0npXD5xhFYQ";
const polygonProjectId = "oqAbxlGxv1txPD30aF-9w2oeECzJk9AJ"
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat:{
      chainId: 1337
    },
    rinkeby:{
      url: process.env.STAGING_ALCHEMY_RINKEBY_KEY,
      accounts:[process.env.PRIVATE_KEY1]
    },
    mumbai:{
      url: process.env.STAGING_ALCHEMY_POLYGON_KEY,
      accounts:[process.env.PRIVATE_KEY1]
    },
    mainnet:{
      chainId:1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts:[process.env.PRIVATE_KEY1]
    }
  },
};
