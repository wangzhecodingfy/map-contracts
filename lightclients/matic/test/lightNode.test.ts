import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
let data = require("../data/blocks.js");
import {
    BlockHeader, getBlock,
    TxLog, ReceiptProof,
    TxReceipt, index2key,
    ProofData
} from "../utils/Util"

// //extraData =  EXTRA_VANITY + (address + power)... + EXTRASEAL 32 + 40*n + 65
let minEpochBlockExtraDataLen = 137
let chainId = 137
let confirms = process.env.CONFIRMS

describe("LightNode", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deployFixture() {
        let [wallet] = await ethers.getSigners();

        const MPTVerify = await ethers.getContractFactory("MPTVerify");

        const mPTVerify = await MPTVerify.deploy();

        await mPTVerify.connect(wallet).deployed();

        const LightNode = await ethers.getContractFactory("LightNode");

        const lightNode = await LightNode.deploy();

        await lightNode.connect(wallet).deployed();

        const LightNodeProxy = await ethers.getContractFactory("LightNodeProxy");

        let initBlock = data.initBlock;

        let initData = LightNode.interface.encodeFunctionData("initialize", [chainId,minEpochBlockExtraDataLen, wallet.address, mPTVerify.address,confirms,initBlock]);

        const lightNodeProxy = await LightNodeProxy.deploy(lightNode.address, initData);

        await lightNodeProxy.connect(wallet).deployed();

        let proxy = LightNode.attach(lightNodeProxy.address);

        return proxy;

    }

    describe("Deployment", function () {


        it("initBlock() -> correct", async function () {


            let [wallet, other] = await ethers.getSigners();

            const lightNode = await loadFixture(deployFixture);

            let current = await lightNode.headerHeight();

            expect(current).to.eq(34765823)

        });

        it("upgradeTo() -> reverts only Admin", async function () {

            let [wallet, other] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);

            let admin = await lightNode.getAdmin();

            expect(admin).to.not.eq(other.address);

            const LightNode = await ethers.getContractFactory("LightNode");
            const newImplement = await LightNode.connect(wallet).deploy();
            await newImplement.deployed();

            await expect(lightNode.connect(other).upgradeTo(newImplement.address)).to.be.revertedWith('LightNode: only Admin can upgrade');

        });

        it("upgradeTo() -> correct", async function () {

            let [wallet, other] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);

            let admin = await lightNode.getAdmin();

            expect(admin).to.not.eq(other.address);

            const LightNode = await ethers.getContractFactory("LightNode");
            const newImplement = await LightNode.connect(wallet).deploy();
            await newImplement.deployed();

            let oldImplement = await lightNode.getImplementation();

            expect(oldImplement).to.not.eq(newImplement.address);

            await lightNode.connect(wallet).upgradeTo(newImplement.address);

            expect(await lightNode.getImplementation()).to.eq(newImplement.address);

        });


        it("changeAdmin() -> reverts only Admin", async function () {

            let [wallet, other] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);

            let admin = await lightNode.getAdmin();

            expect(admin).to.eq(wallet.address);

            await expect(lightNode.connect(other).setPendingAdmin(other.address)).to.be.revertedWith("lightnode :: only admin");

        });

        it("changeAdmin() -> reverts for zero address", async function () {

            let [wallet, other] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);

            let admin = await lightNode.getAdmin();

            expect(admin).to.eq(wallet.address);

            await expect(lightNode.connect(wallet).setPendingAdmin(ethers.constants.AddressZero)).to.be.revertedWith("Ownable: pendingAdmin is the zero address");

        });

        it("changeAdmin() -> correct ", async function () {

            let [wallet, other] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);

            let admin = await lightNode.getAdmin();

            expect(admin).to.eq(wallet.address); 

            await (await lightNode.connect(wallet).setPendingAdmin(other.address)).wait();

            let pendingAdmin = await lightNode.pendingAdmin();

            expect(pendingAdmin).eq(other.address);

            await expect(lightNode.connect(wallet).changeAdmin()).to.be.revertedWith('only pendingAdmin');

            await (await lightNode.connect(other).changeAdmin()).wait();


            expect(await lightNode.getAdmin()).to.eq(other.address);


        });


        it("togglePause() -> reverts  only admin ", async function () {

            let [wallet, other] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);

            let paused = await lightNode.paused();

            expect(paused).to.false;

            await expect(lightNode.connect(other).togglePause(true)).to.be.revertedWith("lightnode :: only admin");

        });

        it("togglePause() -> correct ", async function () {

            let [wallet, other] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);

            let paused = await lightNode.paused();

            expect(paused).to.false;

            await lightNode.connect(wallet).togglePause(true);

            expect(await lightNode.paused()).to.true;

            await lightNode.connect(wallet).togglePause(false);

            expect(await lightNode.paused()).to.false;

        });


        it("updateBlockHeader() -> reverts paused ", async function () {

            let [wallet] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);


            await lightNode.connect(wallet).togglePause(true);

            await expect(lightNode.updateBlockHeader(await lightNode.getHeadersBytes(data.addBlock_1s))).to.be.revertedWith('Pausable: paused');

        });

        it("updateBlockHeader() -> correct ", async function () {

            let [wallet] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);


            await lightNode.updateBlockHeader(await lightNode.getHeadersBytes(data.addBlock_1s));

            let current = await lightNode.headerHeight();

            expect(current).to.eq(34765887)

            await lightNode.updateBlockHeader(await lightNode.getHeadersBytes(data.addBlock_2s));

            current = await lightNode.headerHeight();

            expect(current).to.eq(34765951)

        });


        it("verifyProofData() -> correct ", async function () {

            let [wallet] = await ethers.getSigners();

            let lightNode = await loadFixture(deployFixture);


            await lightNode.updateBlockHeader(await lightNode.getHeadersBytes(data.addBlock_1s));

            let current = await lightNode.headerHeight();

            expect(current).to.eq(34765887)

            let receiptProof = new ReceiptProof(data.txReceipt, index2key(BigNumber.from(data.proof.key).toNumber(), data.proof.proof.length), data.proof.proof);

            let proofData = new ProofData(data.proofHeaders, receiptProof);

            let proofBytes = await lightNode.getBytes(proofData);

            let result = await lightNode.verifyProofData(proofBytes, { gasLimit: 20000000 });

            expect(result.success).to.true;
        });



    });




});
