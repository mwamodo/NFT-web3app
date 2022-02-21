const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("XeroInt", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const XeroInt = await ethers.getContractFactory("XeroInt");
    const xeroint = await XeroInt.deploy();
    await xeroint.deployed();

    const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const metadataURI = "cid/test.png";

    let balance = await xeroint.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await xeroint.payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    // wait until the transaction is mined
    await newlyMintedToken.wait();
    balance = await xeroint.balanceOf(recipient);

    expect(await xeroint.isContentOwned(metadataURI)).to.equal(true);
  });
});
