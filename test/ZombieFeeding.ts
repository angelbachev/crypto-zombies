import {time, loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZombieFeeding", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ZombieFeeding = await ethers.getContractFactory("ZombieFeeding");
        const zombieFeeding = await ZombieFeeding.deploy();

        const KittyFactory = await ethers.getContractFactory("KittyFactory");
        const kittyFactory = await KittyFactory.deploy();

        const kittyIds = ['2023461', '2023462', '2023463', '2023464', '2023465'];
        const kittyGenes = [
            '628079516603167937505550371949243854553241459749706268951321943647192097',
            '241581720882345840826530416449610077917568793411866277407546080279795156',
            '628295030008073328031444275748460409888271886088522356983483785785063617',
            '463018625203047166245386726632628581844676267906694227885750172493383619',
            '627446168201112782088513754950183396258266728107044803377359472668721251',
        ];
        await kittyFactory.createManyKitties(kittyIds, kittyGenes);

        const ONE_DAY_IN_SECS = 24 * 60 * 60;
        const coolDownTime = (await time.latest()) + ONE_DAY_IN_SECS;

        return {zombieFeeding, owner, otherAccount, kittyFactory, kittyIds, kittyGenes, coolDownTime};
    }

    it("Should set kitty contract address", async function () {
        const {zombieFeeding, kittyFactory} = await loadFixture(deployFixture);

        const kittyContractAddress = kittyFactory.target;

        await zombieFeeding.setKittyContractAddress(kittyContractAddress);

        expect(await zombieFeeding.getKittyContractAddress()).to.equal(kittyContractAddress);
    });

    it("Should get kitty dna", async function () {
        const {zombieFeeding, kittyFactory, kittyIds, kittyGenes} = await loadFixture(deployFixture);
        await zombieFeeding.setKittyContractAddress(kittyFactory.target);

        expect(await zombieFeeding.getKittyDna(kittyIds[0])).to.equal(kittyGenes[0]);
    });

    it("Should feed on kitty", async function () {
        const {zombieFeeding, kittyFactory, kittyIds, kittyGenes, coolDownTime} = await loadFixture(deployFixture);
        await zombieFeeding.setKittyContractAddress(kittyFactory.target);

        await zombieFeeding.createRandomZombie("Test");
        await time.increaseTo(coolDownTime + 5);
        await zombieFeeding.feedOnKitty(0, kittyIds[0]);
        const newZombie = await zombieFeeding.zombies(1);

        expect(newZombie.name).to.equal("NoName");
    });
});
