import { useState } from 'react';
import { ethers } from "ethers";
import WalletBalance from "./WalletBalance";

import XeroInt from '../artifacts/contracts/xeroint.sol/XeroInt.json';
import { useEffect } from "react";
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, XeroInt.abi, signer);

function Home () {
    const [totalMinted, setMintTotal] = useState(0);
    useEffect(() => {
        getCount();
    }, [])

    const getCount = async () => {
        const count = await contract.count();
        setMintTotal(parseInt(count));
    }

    return (
        <div>
            <WalletBalance />

            <h1>XeroInt NFT Collection</h1>
            {Array(totalMinted + 1)
                .fill(0)
                .map((_, i) => (
                    <div key={i}>
                    <NFTImage tokenId={i} getCount={getCount} />
                    </div>
                ))}
        </div>
    );
}

function NFTImage({ tokenId, getCount }) {
    const contentId = 'Qmc245hc3EbhGrhXZTTghXXqP2X6gBKZRqAQ9nJ1m6MRht';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.jpg`;

    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };

    const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.05'),
      });

      await result.wait();
      getMintedStatus();
      getCount();
    };

    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    return (
      <div className="" style={{ width: '18rem' }}>
        {/* <img className="" src={isMinted ? imageURI : 'img/placeholder.png'}></img> */}
        <img className="" src={ imageURI }></img>
        <div className="">
          <h5 className="">ID #{tokenId}</h5>
          {!isMinted ? (
            <button className="" onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button className="" onClick={getURI}>
              Taken! Show URI
            </button>
          )}
        </div>
      </div>
    );
  }

export default Home;
