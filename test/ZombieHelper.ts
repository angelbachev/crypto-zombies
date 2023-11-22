import {time, loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZombieHelper", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ZombieHelper = await ethers.getContractFactory("ZombieHelper");
        const zombieHelper = await ZombieHelper.deploy();

        const ONE_DAY_IN_SECS = 24 * 60 * 60;

        const coolDownTime = (await time.latest()) + ONE_DAY_IN_SECS;

        return {zombieHelper, owner, otherAccount, coolDownTime};
    }

    describe("ZombieHelper", function () {
        it("Get zombies by owner", async function () {
            const {zombieHelper, owner} = await loadFixture(deployFixture);

            expect(await zombieHelper.getZombiesByOwner(owner)).to.have.lengthOf(0);

            await zombieHelper.createRandomZombie("Test");

            expect(await zombieHelper.getZombiesByOwner(owner)).to.have.lengthOf(1);
        });

        it("Withdraw", async function () {
            const {zombieHelper, owner} = await loadFixture(deployFixture);

            await zombieHelper.createRandomZombie("Test");

            // TODO: not sure what to test
            await zombieHelper.withdraw();
        });

        it("LevelUp should revert with message if transaction value is not 0.001 ether", async function () {
            const {zombieHelper} = await loadFixture(deployFixture);

            await expect(zombieHelper.levelUp(0)).to.be.revertedWith("Need to pay correct fee in order to level up");
        });

        it("LevelUp succeeds with correct fee", async function () {
            const {zombieHelper} = await loadFixture(deployFixture);
            await zombieHelper.createRandomZombie("Test");

            await expect(zombieHelper.levelUp(0, {value: ethers.parseEther("0.001")})).not.to.be.reverted;
        });

        it("Set level up fee", async function () {
            const {zombieHelper} = await loadFixture(deployFixture);

            await zombieHelper.setLevelUpFee(ethers.parseEther("0.005"));

            await zombieHelper.createRandomZombie("Test");

            await expect(zombieHelper.levelUp(0, {value: ethers.parseEther("0.005")})).not.to.be.reverted;
        });

        it("Change name should revert with message if level is below 2", async function () {
            const {zombieHelper} = await loadFixture(deployFixture);

            await zombieHelper.createRandomZombie("Test");

            await expect(zombieHelper.changeName(0, "New name")).to.be.revertedWith("Invalid level");
        });

        it("Only owner can change zombie name", async function () {
            const {zombieHelper, otherAccount} = await loadFixture(deployFixture);

            await zombieHelper.createRandomZombie("Test");
            await zombieHelper.levelUp(0, {value: ethers.parseEther("0.001")});

            await expect(zombieHelper.connect(otherAccount).changeName(0, "New name"))
                .to.be.revertedWith("Only owner");
        });

        it("Change name will succeed", async function () {
            const {zombieHelper} = await loadFixture(deployFixture);

            await zombieHelper.createRandomZombie("Test");
            await zombieHelper.levelUp(0, {value: ethers.parseEther("0.001")});

            const newName = "New name";
            await zombieHelper.changeName(0, newName);
            const zombie = await zombieHelper.zombies(0);

            expect(zombie.name).to.equal(newName);
        });

        it("Change dna should revert with message if level is below 20", async function () {
            const {zombieHelper} = await loadFixture(deployFixture);

            await zombieHelper.createRandomZombie("Test");
            await expect(zombieHelper.changeDna(0, ethers.getBigInt("7529263028730800"))).to.be.revertedWith("Invalid level");
        });

        it("Only owner can change zombie dna", async function () {
            const {zombieHelper, otherAccount} = await loadFixture(deployFixture);

            await zombieHelper.createRandomZombie("Test");
            for (let i=1; i < 20; i++) {
                await zombieHelper.levelUp(0, {value: ethers.parseEther("0.001")});
            }

            await expect(zombieHelper.connect(otherAccount).changeDna(0, ethers.getBigInt("7529263028730800")))
                .to.be.revertedWith("Only owner");
        });

        it("Change dna will succeed", async function () {
            const {zombieHelper} = await loadFixture(deployFixture);

            await zombieHelper.createRandomZombie("Test");
            for (let i=1; i < 20; i++) {
                await zombieHelper.levelUp(0, {value: ethers.parseEther("0.001")});
            }
            const newDna = ethers.getBigInt("7529263028730800");
            await zombieHelper.changeDna(0, newDna);
            const zombie = await zombieHelper.zombies(0);

            expect(zombie.dna).to.equal(newDna);
        });
    });
});
