import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function App() {
  // Store Greeting in local state
  const [greetingValue, setGreetingValue] = useState('');

  // Request access to user's Wallet account
  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        console.log('data: ', data);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  };

  const setGreeting = async () => {
    if (!greetingValue) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greetingValue);
      await transaction.wait();
      fetchGreeting();
    }
  };

  const runGreeter = () => {
    console.log('Greeter ABI: ', Greeter.abi);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Eth Viewer</h1>
        <button onClick={() => runGreeter()}>Greeter ABI</button>
        <button onClick={() => fetchGreeting()}>Fetch Greeting</button>
        <button onClick={() => setGreeting()}>Set Greeting</button>
        <input onChange={(e) => setGreetingValue(e.target.value)} placeholder="Set Greeting Value" />
      </header>
    </div>
  );
}

export default App;
