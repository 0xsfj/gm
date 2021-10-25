import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Button, Text, Input } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import abi from '../artifacts/contracts/GmPortal.sol/GmPortal.json';
import { Logo } from '../components/Logo';

const GM = () => {
  const contractAddress = '0x9Bd5B6952D82b1dCE64B15C8511B2e9146D2a749';
  const contractAbi = abi.abi;

  const [currentAccount, setCurrentAccount] = useState('');
  const [allGms, setAllGms] = useState([]);
  const [gmMessageValue, setGmMessageValue] = useState('');
  const [ens, setEns] = useState('');

  function rotateTranslateTemplate({ rotate, x }) {
    return `rotate(${rotate}) translateX(${x})`;
  }

  const checkIfWalletIsConnected = async () => {
    try {
      // Check for window.ethereum and wallet provider
      const { ethereum } = window;

      if (!ethereum) {
        console.log(`Make sure you have MetaMask or other browser wallet`);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(`Found an authorized account: `, account);
        setCurrentAccount(account);
      } else {
        console.log(`No accounts found.`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const account = accounts[0];
      setCurrentAccount(account);
    } catch (error) {
      console.log(error);
    }
  };

  const sendGM = async () => {
    try {
      const { ethereum } = window;
      console.log(ethereum);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const ens = await provider.lookupAddress(currentAccount);

        console.log(ens);
        const signer = provider.getSigner();
        const gmPortalContract = new ethers.Contract(contractAddress, contractAbi, signer);

        // Get Total Waves

        let count = await gmPortalContract.getTotalGms();
        console.log(`Retreived total wave count...`, count.toNumber());

        // Mint GM
        const gmTxn = await gmPortalContract.gm(gmMessageValue, { gasLimit: 300000 });
        console.log(`Minting GM...`, gmTxn.hash);

        await gmTxn.wait();
        console.log(`GM minted!`, gmTxn.hash);

        count = await gmPortalContract.getTotalGms();
        console.log(`Retreived total sent gms count...`, count.toNumber());
      } else {
        console.log('No ethereum object found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllGms = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gmPortalContract = new ethers.Contract(contractAddress, contractAbi, signer);

        // Call get all gms
        const gms = await gmPortalContract.getAllGms();

        console.log(gms);
        // clean the gms
        let gmsCleaned = [];
        gms.forEach((gm) => {
          gmsCleaned.push({
            address: gm.gmer,
            timestamp: new Date(gm.timestamp * 1000),
            message: gm.message,
          });
        });

        console.log(gmsCleaned);

        setAllGms(gmsCleaned.reverse());

        // Listen for GM's being minted
        gmPortalContract.on('NewGm', (from, timestamp, message) => {
          console.log(`New GM from ${from} at ${timestamp} with message ${message}`);
          setAllGms((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
          ]);
        });
      } else {
        console.log('No ethereum object found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check if authorized to access wallet
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    console.log(`Current Account`);
    console.log(currentAccount);
    getAllGms();
  }, [currentAccount]);

  const Sun = motion(Box);
  const Light = motion(Box);
  const HoverButton = motion(Button);

  return (
    <Box bg="#E8D5CB" w="100vw" h="100vh" pos="relative" display="flex" alignItems="center" justifyContent="start" flexDirection="column">
      <Box>
        <Text textAlign="center" fontSize="20vw" color="#524A47" fontWeight="extrabold">
          GM
        </Text>
        <Text textAlign="center" fontSize="3vw" color="#524A47" fontWeight="bold">
          say good morning
          {/* say <span>good morning</span> <span>get money</span> to sfj.eth */}
        </Text>
      </Box>

      {/* <Sun pos="absolute" bottom="0" bg="#FFA615" w="15vw" height="15vw" borderRadius="50%" transformTemplate={rotateTranslateTemplate} animate={{ rotate: [180, 360] }} style={{ rotate: 0, x: 'calc(50vw - 100px)' }} transition={{ delay: 1, ease: 'linear', duration: 4 }}></Sun> */}

      <Box pos="absolute" bottom="0" minH="15vw" overflow="hidden" bg="#D5BBAE" w="100vw" mx="auto" display="flex" flexDirection="column" justifyContent="left" alignItems="start">
        {/* <Light pos="absolute" bottom="0" bg="#FFA615" w="10vw" h="100%" style={{ filter: 'blur(50px)', x: '-50vw' }} animate={{ x: '50vw' }} transition={{ delay: 1, ease: 'linear', duration: 4 }}></Light> */}

        <Box display="flex" flexDirection="row" overflowX="scroll" whiteSpace="nowrap" pos="relative" w="100%">
          {allGms.map((gm, key) => {
            return (
              <Box key={key} p="3" w="100%" mr="4" borderRadius="3xl">
                <Text fontSize="1xl" fontWeight="medium" color="#524A47">
                  {gm.timestamp.toLocaleString()}
                </Text>
                <Text fontSize="1xl" fontWeight="extrabold" color="#524A47">
                  {gm.message}
                </Text>
              </Box>
            );
          })}
        </Box>
        <Box display="flex" width="100%" justifyContent="center" alignItems="center" flexDirection="column" p="6">
          {!currentAccount ? (
            <HoverButton
              onClick={connectWallet}
              color="#524A47"
              type="submit"
              bg="#F6EDE1"
              size="lg"
              fontSize="3xl"
              fontWeight="extrabold"
              whileHover={{
                scale: 1.2,
                transition: { duration: 1 },
              }}
            >
              connect wallet
            </HoverButton>
          ) : (
            <>
              <Input placeholder="gm" maxW="3xl" mb="4" onChange={(e) => setGmMessageValue(e.target.value)} value={gmMessageValue} fontWeight="extrabold" fontSize="3xl" borderRadius="2xl" />
              <HoverButton
                onClick={sendGM}
                position="relative"
                borderRadius="2xl"
                color="#524A47"
                type="submit"
                bg="#F6EDE1"
                size="lg"
                fontSize="3xl"
                fontWeight="extrabold"
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
              >
                <Logo w="12" h="12" p="0" />
                send gm
              </HoverButton>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GM;
