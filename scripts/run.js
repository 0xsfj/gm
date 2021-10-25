const hre = require('hardhat');

const main = async () => {
  const [owner, randoPerson] = await hre.ethers.getSigners();
  const gmContractFactory = await hre.ethers.getContractFactory('GmPortal');
  const gmContract = await gmContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await gmContract.deployed();

  console.log(`Deployed Gm Portal at: ${gmContract.address}`);
  console.log(`Contract deployed by: ${owner.address}`);

  // Get contract balance
  let contractBalance = await hre.ethers.provider.getBalance(gmContract.address);
  console.log('Contract balance: ', hre.ethers.utils.formatEther(contractBalance));

  let gmCount;
  gmCount = await gmContract.getTotalGms();

  let gmTxn = await gmContract.gm('This is the first Wave');
  await gmTxn.wait();

  gmCount = await gmContract.getTotalGms();

  //   gmTxn = await gmContract.gm('This will error out');
  //   await gmTxn.wait();

  gmTxn = await gmContract.connect(randoPerson).gm('This is the second wave');
  await gmTxn.wait();

  gmCount = await gmContract.getTotalGms();
  console.log(`Total Gms: ${gmCount}`);

  // Get contract balance
  contractBalance = await hre.ethers.provider.getBalance(gmContract.address);
  console.log('Contract balance: ', hre.ethers.utils.formatEther(contractBalance));

  const allGms = await gmContract.getAllGms();

  console.log(allGms);
};

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
