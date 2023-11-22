import {loadFixture, time} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("ZombieOwnership", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ZombieOwnership = await ethers.getContractFactory("ZombieOwnership");
        const zombieOwnership = await ZombieOwnership.deploy();

        await zombieOwnership.createRandomZombie("Zombie");

        const ONE_DAY_IN_SECS = 24 * 60 * 60;

        const unlockTime = (await time.latest()) + ONE_DAY_IN_SECS;

        return {zombieOwnership, owner, otherAccount, unlockTime};
    }

    describe("ZombieOwnership", function () {
        it("Should return balance of owner", async function () {
            const {zombieOwnership, owner} = await loadFixture(deployFixture);

            expect(await zombieOwnership.balanceOf(owner)).to.equal(1);
        });

        it("Should return owner of the zombie", async function () {
            const {zombieOwnership, owner, otherAccount} = await loadFixture(deployFixture);

            expect(await zombieOwnership.ownerOf(0)).to.equal(owner.address);
        });

        it("Transfer zombie to other account", async function () {
            const {zombieOwnership, owner, otherAccount} = await loadFixture(deployFixture);

            await zombieOwnership.transferFrom(owner, otherAccount, 0);

            expect(await zombieOwnership.ownerOf(0)).to.equal(otherAccount.address);
        });

        it("Transfer zombie to other account emit Transfer event", async function () {
            const {zombieOwnership, owner, otherAccount} = await loadFixture(deployFixture);

            await expect(zombieOwnership.transferFrom(owner, otherAccount, 0))
                .to.emit(zombieOwnership, "Transfer")
                .withArgs(owner.address, otherAccount.address, 0);
        });

        it("Transfer zombie to other account reverts in case of incorrect owner or missing approval", async function () {
            const {zombieOwnership, owner, otherAccount} = await loadFixture(deployFixture);

            await expect(zombieOwnership.connect(otherAccount).transferFrom(owner, otherAccount, 0)).to.be.reverted;
        });

        it("Transfer zombie to other account succeeds if transfer is approved by the owner", async function () {
            const {zombieOwnership, owner, otherAccount} = await loadFixture(deployFixture);

            await zombieOwnership.approve(otherAccount, 0);
            await zombieOwnership.connect(otherAccount).transferFrom(owner, otherAccount, 0)

            expect(await zombieOwnership.ownerOf(0)).to.equal(otherAccount.address);
        });

        it("Approve fails if account is not the onwer of the zombie", async function () {
            const {zombieOwnership, owner, otherAccount} = await loadFixture(deployFixture);

            await expect(zombieOwnership.connect(otherAccount).approve(otherAccount, 0)).to.be
                .revertedWith("Only owner");
        });
    });
});
