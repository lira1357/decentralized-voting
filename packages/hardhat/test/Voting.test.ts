import { expect } from "chai";
import { ethers } from "hardhat";

describe("Voting", function () {
  let Voting: any;
  let voting: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    Voting = await ethers.getContractFactory("Voting");
    [, addr1, addr2] = await ethers.getSigners();

    voting = await Voting.deploy(["Alice", "Bob", "Charlie"]);
    await voting.waitForDeployment();
  });

  it("Should deploy with correct candidates", async function () {
    const candidate0 = await voting.candidates(0);
    const candidate1 = await voting.candidates(1);
    const candidate2 = await voting.candidates(2);

    expect(candidate0.name).to.equal("Alice");
    expect(candidate1.name).to.equal("Bob");
    expect(candidate2.name).to.equal("Charlie");
  });

  it("Should allow voting for a candidate", async function () {
    await voting.connect(addr1).vote(0);

    const candidate0 = await voting.candidates(0);
    expect(candidate0.voteCount).to.equal(1);
  });

  it("Should NOT allow double voting", async function () {
    await voting.connect(addr1).vote(0);

    await expect(voting.connect(addr1).vote(1)).to.be.revertedWith("You have already voted");
  });

  it("Should NOT allow voting for invalid candidate", async function () {
    await expect(voting.connect(addr1).vote(10)).to.be.revertedWith("Invalid candidate index");
  });

  it("Should return correct winner", async function () {
    await voting.connect(addr1).vote(1); // vote for Bob
    await voting.connect(addr2).vote(1); // vote for Bob

    const winner = await voting.getWinner();

    expect(winner[0]).to.equal("Bob"); // name
    expect(Number(winner[1])).to.equal(2); // votes
  });
});
