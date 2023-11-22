import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("KittyFactory", function () {
    const kittyId = "2023466";
    const kittyGenes = "626946158604661586648952140895505976230909146733028279049988718104967693";

    async function deployFixture() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const KittyFactory = await ethers.getContractFactory("KittyFactory");
        const kittyFactory = await KittyFactory.deploy();

        return {kittyFactory, owner, otherAccount};
    }

    async function deployWithKittyFixture() {
        const {kittyFactory} = await deployFixture();
        await kittyFactory.createKitty(kittyId, kittyGenes);

        return {kittyFactory, kittyId, kittyGenes};
    }

    describe("Deployment", function () {
        it("Should have no kitties", async function () {
            const {kittyFactory} = await loadFixture(deployFixture);
            expect(await kittyFactory.getKittiesIds()).to.be.an("array").that.is.empty
        });
    });

    describe("Functionality", function () {
        it("Should get a kitty", async function () {
            const {kittyFactory, kittyId, kittyGenes} = await loadFixture(deployWithKittyFixture);
            const kitty = await kittyFactory.getKitty(kittyId);
            expect(kitty.genes).to.equals(kittyGenes);

        });

        it("Should create a kitty", async function () {
            const {kittyFactory} = await loadFixture(deployFixture);

            const id = "2023465";
            const genes = "627446168201112782088513754950183396258266728107044803377359472668721251";
            await kittyFactory.createKitty(id, genes);

            const actualGenes = await kittyFactory.genesOfKitties(id);
            expect(actualGenes).to.equals(genes);
        });

        it("Should not create a kitty with existing id and genes", async function () {
            const {kittyFactory} = await loadFixture(deployWithKittyFixture);

            expect(await kittyFactory.genesOfKitties(kittyId)).to.equals(kittyGenes);

            const kittiesIds = await kittyFactory.getKittiesIds();

            await kittyFactory.createKitty(kittyId, kittyGenes);
            expect(await kittyFactory.genesOfKitties(kittyId)).to.equals(kittyGenes);

            expect(await kittyFactory.getKittiesIds()).to.deep.equal(kittiesIds);
        });

        it("Should update kitty genes of existing kitty", async function () {
            const {kittyFactory} = await loadFixture(deployWithKittyFixture);

            expect(await kittyFactory.genesOfKitties(kittyId)).to.equals(kittyGenes);

            const kittiesIds = await kittyFactory.getKittiesIds();

            const newGenes = "627446168201112782088513754950183396258266728107044803377359472668721251";
            await kittyFactory.createKitty(kittyId, newGenes);
            expect(await kittyFactory.genesOfKitties(kittyId)).to.equals(newGenes);

            expect(await kittyFactory.getKittiesIds()).to.deep.equal(kittiesIds);
        });

        it("Should get kitties ids", async function () {
            const {kittyFactory} = await loadFixture(deployWithKittyFixture);

            const id = "2023465";
            const genes = "627446168201112782088513754950183396258266728107044803377359472668721251";
            await kittyFactory.createKitty(id, genes);

            const kittiesIds = await kittyFactory.getKittiesIds();
            expect(kittiesIds.length).to.equals(2);
        });

        it("Should create many kitties", async function () {
            const {kittyFactory} = await loadFixture(deployFixture);

            const ids = [2023461, 2023462, 2023463, 2023464];
            const genes = [
                "628079516603167937505550371949243854553241459749706268951321943647192097",
                "241581720882345840826530416449610077917568793411866277407546080279795156",
                "628295030008073328031444275748460409888271886088522356983483785785063617",
                "463018625203047166245386726632628581844676267906694227885750172493383619",
            ];
            await kittyFactory.createManyKitties(ids, genes);

            expect(await kittyFactory.getKittiesIds()).to.deep.equal(ids);
        });

        it("Should create many kitties ids count doesn\'t much genes count", async function () {
            const {kittyFactory} = await loadFixture(deployFixture);

            const ids = [2023461, 2023462, 2023463];
            const genes = [
                "628079516603167937505550371949243854553241459749706268951321943647192097",
                "241581720882345840826530416449610077917568793411866277407546080279795156",
                "628295030008073328031444275748460409888271886088522356983483785785063617",
                "463018625203047166245386726632628581844676267906694227885750172493383619",
            ];

            await expect(kittyFactory.createManyKitties(ids, genes)).to.be.revertedWith(
                "The number of ids should be equal to the number of genes"
            );
        });
    });
});
