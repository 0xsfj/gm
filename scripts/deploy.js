// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log(`Deploying contracts with account: `, deployer.address);
  console.log(`Account balance: `, accountBalance.toString());

  const gmContractFactory = await hre.ethers.getContractFactory('GmPortal');
  const gmPortal = await gmContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.01'),
  });

  console.log(`GM Portal Address: `, gmPortal.address);

  await gmPortal.deployed();

  // We get the contract to deploy
  // From Nader Tutorial
  // const Greeter = await hre.ethers.getContractFactory('Greeter');
  // const greeter = await Greeter.deploy('Hello, Hardhat!');

  // await greeter.deployed();

  // console.log('Greeter deployed to:', greeter.address);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
