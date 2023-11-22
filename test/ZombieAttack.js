const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");

describe("ZombieAttack", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ZombieAttack = await ethers.getContractFactory("ZombieAttack");
        const zombieAttack = await ZombieAttack.deploy();

        const ONE_DAY_IN_SECS = 24 * 60 * 60;
        const coolDownTime = (await time.latest()) + ONE_DAY_IN_SECS;

        return {zombieAttack, owner, otherAccount, coolDownTime};
    }

    it("Attack zombie", async function () {
        const {zombieAttack, coolDownTime, owner, otherAccount} = await loadFixture(deployFixture);

        await zombieAttack.createRandomZombie("My Zombie");
        await zombieAttack.connect(otherAccount).createRandomZombie("Enemy");

        await time.increaseTo(coolDownTime + 5);
        await zombieAttack.attack(0, 1);
        const myZombie = await zombieAttack.zombies(0);
        const enemyZombie = await zombieAttack.zombies(1);

        if (myZombie.winCount == 1) {
            expect(myZombie.lossCount).to.equal(0);
            expect(enemyZombie.lossCount).to.equal(1);
            expect(enemyZombie.winCount).to.equal(0);
            expect(await zombieAttack.zombieToOwner(2)).to.equal(owner.address);
            expect((await zombieAttack.zombies(2)).name).to.equal('NoName');
        } else {
            expect(myZombie.lossCount).to.equal(1);
            expect(enemyZombie.lossCount).to.equal(0);
            expect(enemyZombie.winCount).to.equal(1);
        }
    });
});
