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
        <div className="max-w-7xl mx-auto">
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
      <div className="max-w-7xl mx-auto" >
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <span className="relative">
                <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                    <img src={imageURI} alt="" className="object-cover pointer-events-none group-hover:opacity-75" />
                    {/* <img className="" src={isMinted ? imageURI : 'img/placeholder.png'}></img> */}
                    <button type="button" className="absolute inset-0 focus:outline-none">
                        <span className="sr-only">View details for</span>
                    </button>
                </div>
                <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">ID #{tokenId}</p>
            </span>
        </div>
        <div className="">
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
