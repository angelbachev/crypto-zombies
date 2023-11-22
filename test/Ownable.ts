import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Ownable", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const Ownable = await ethers.getContractFactory("Ownable");
        const ownable = await Ownable.deploy();

        return {ownable, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const {ownable, owner} = await loadFixture(deployFixture);

            expect(await ownable.owner()).to.equal(owner.address);
        });
    });

    describe("isOwner", function () {
        it("Should return true", async function () {
            const {ownable, owner} = await loadFixture(deployFixture);

            expect(await ownable.isOwner()).to.be.true;
        });

        it("Should return false", async function () {
            const {ownable, otherAccount} = await loadFixture(deployFixture);

            expect(await ownable.connect(otherAccount).isOwner()).to.be.false;
        });
    });

    describe("renounceOwnership", function () {
        it("Should emit OwnershipTransferred event", async function () {
            const {ownable, owner} = await loadFixture(deployFixture);

            await expect(ownable.renounceOwnership())
                .to.emit(ownable, "OwnershipTransferred")
                .withArgs(owner.address, ethers.ZeroAddress);

            expect(await ownable.owner()).to.equal(ethers.ZeroAddress);
        });

        it("Should revert with message", async function () {
            const {ownable, otherAccount} = await loadFixture(deployFixture);

            await expect(ownable.connect(otherAccount).renounceOwnership()).to.be
                .revertedWith("Only owner can call this function");
        });
    });

    describe("transferOwnership", function () {
        it("Should transfer ownership to other account", async function () {
            const {ownable, owner, otherAccount} = await loadFixture(deployFixture);

            await expect(ownable.transferOwnership(otherAccount.address))
                .to.emit(ownable, "OwnershipTransferred")
                .withArgs(owner.address, otherAccount.address);

            expect(await ownable.owner()).to.be.equals(otherAccount.address);
        });

        it("Should revert with message", async function () {
            const {ownable, owner, otherAccount} = await loadFixture(deployFixture);

            await expect(ownable.connect(otherAccount).transferOwnership(owner)).to.be
                .revertedWith("Only owner can call this function");
        });
    });
});
