import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZombieFactory", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ZombieFactory = await ethers.getContractFactory("ZombieFactory");
        const zombieFactory = await ZombieFactory.deploy();

        return {zombieFactory, owner, otherAccount};
    }

    describe("createRandomZombie", function () {
        it("Should create a random zombie", async function () {
            const {zombieFactory, owner} = await loadFixture(deployFixture);

            const zombieName = 'Test';
            await zombieFactory.createRandomZombie(zombieName);

            const zombie = await zombieFactory.zombies(0);
            expect(zombie.name).to.equal(zombieName);
            expect(await zombieFactory.zombieToOwner(0)).to.equal(owner.address);

        });

        it("Should emit NewZombie event", async function () {
            const {zombieFactory, owner} = await loadFixture(deployFixture);

            const zombieName = 'Test';
            await expect(zombieFactory.createRandomZombie(zombieName))
                .to.emit(zombieFactory, "NewZombie")
                .withArgs(ethers.getBigInt(0),zombieName, anyValue);
        });

        it("Should revert with message", async function () {
            const {zombieFactory, owner} = await loadFixture(deployFixture);

            const zombieName = 'Test';
            await zombieFactory.createRandomZombie(zombieName);

            await expect(zombieFactory.createRandomZombie(zombieName)).to.be
                .revertedWith("Only 1 random zombie is allowed");
        });
    });
});
