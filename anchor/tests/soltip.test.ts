// import * as anchor from "@coral-xyz/anchor";
// import { Program, web3, Provider } from "@coral-xyz/anchor";
// import { Soltip } from "../target/types/soltip";
// import { assert } from "chai";

// describe("soltip", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.soltip as Program<Soltip>;

//   const creator = web3.Keypair.generate();
//   let provider: Provider;

//   beforeEach(async () => {
//     provider = anchor.getProvider();
//     const airdropSignature = await provider.connection.requestAirdrop(
//       creator.publicKey,
//       web3.LAMPORTS_PER_SOL * 10
//     );

//     await provider.connection.confirmTransaction(airdropSignature);
//   })

//   describe("Profile", () => {
//     it("should initialize", async () => {
//       const name = "Anurag Munda";
//       const email = "anurag@example.com";
//       const bio = "I'm a blockchain developer";
//       const aboutMe = "This is a large description about me. I love coding."

//       await program.methods
//         .initializeProfile(name, email, bio, aboutMe)
//         .accounts({
//           creator: creator.publicKey,
//         })
//         .signers([creator])
//         .rpc();

//       const accounts = await program.account.profile.all();
//       const profile = accounts[0].account;

//       assert(profile.creator.equals(creator.publicKey));
//       assert.equal(accounts.length, 1);
//       assert.equal(profile.name, name);
//       assert.equal(profile.email, email);
//       assert.equal(profile.bio, bio);
//       assert.equal(profile.aboutMe, aboutMe);
//       assert.equal(profile.supporterCount, 0);
//     })

//     it("should update", async () => {
//       let name = "Nishit Lugun"
//       let email = "NishGugun@gmail.com"
//       let bio = "Hi! I'm Nishit Lugun"
//       let aboutMe = "An awesome frontend developer. I make 3d web pages."

//       await program.methods
//         .updateProfile(name, email, bio, aboutMe)
//         .accounts({
//           creator: creator.publicKey
//         })
//         .signers([creator])
//         .rpc()

//       const accounts = await program.account.profile.all()
//       const profile = accounts[0].account

//       assert.equal(profile.name, name)
//       assert.equal(profile.email, email)
//       assert.equal(profile.bio, bio)
//       assert.equal(profile.aboutMe, aboutMe)
//     })

//     it("should update with less values", async () => {
//       let name = "Rohit Munda"
//       let email = "Rohit@gmail.com"
//       let unchangedBio = "Hi! I'm Nishit Lugun"
//       let unchangedUpdateMe = "An awesome frontend developer. I make 3d web pages."

//       await program.methods
//         .updateProfile(name, email, null, null)
//         .accounts({
//           creator: creator.publicKey
//         })
//         .signers([creator])
//         .rpc()

//       const accounts = await program.account.profile.all()
//       const profile = accounts[0].account

//       assert.equal(profile.name, name)
//       assert.equal(profile.email, email)
//       assert.equal(profile.bio, unchangedBio)
//       assert.equal(profile.aboutMe, unchangedUpdateMe)
//     })

//     it("should close", async () => {
//       const accounts = await program.account.profile.all()
//       const profile = accounts[0]

//       const profileBalance = await provider.connection.getBalance(profile.publicKey);
//       const creatorBalance = await provider.connection.getBalance(creator.publicKey);

//       await program.methods
//         .closeProfile()
//         .accounts({
//           creator: creator.publicKey
//         })
//         .signers([creator])
//         .rpc()

//       const finalProfileBalance = await provider.connection.getBalance(profile.publicKey);
//       const finalCreatorBalance = await provider.connection.getBalance(creator.publicKey);

//       assert.equal(finalProfileBalance, 0);
//       assert.equal(finalCreatorBalance, creatorBalance + profileBalance);
//     })
//   })

//   describe("Creator", () => {
//     const supporter = web3.Keypair.generate();
//     const coinValue = new anchor.BN(1_000_000)
//     let profilePDA

//     before(async () => {
//       const name = "Anurag Munda";
//       const email = "anurag@example.com";
//       const bio = "I'm a blockchain developer";
//       const aboutMe = "This is a large description about me. I love coding."

//       const airdropSignature = await provider.connection.requestAirdrop(
//         supporter.publicKey,
//         web3.LAMPORTS_PER_SOL * 10
//       );

//       await provider.connection.confirmTransaction(airdropSignature);

//       await program.methods
//         .initializeProfile(name, email, bio, aboutMe)
//         .accounts({
//           creator: creator.publicKey,
//         })
//         .signers([creator])
//         .rpc();

//       const [pda] = web3.PublicKey.findProgramAddressSync(
//         [Buffer.from("PROFILE"), creator.publicKey.toBuffer()],
//         program.programId
//       );

//       profilePDA = pda
//     })

//     it("should set coin value", async () => {
//       const profileBefore = (await program.account.profile.all())[0].account
//       assert(profileBefore.coinValue.eq(new anchor.BN(0)))

//       await program.methods
//         .setCoinValue(coinValue)
//         .accounts({ creator: creator.publicKey })
//         .signers([creator])
//         .rpc()

//       const profileAfter = (await program.account.profile.all())[0].account
//       assert(profileAfter.coinValue.eq(coinValue))
//     })

//     describe("Supporter", () => {
//       it("should tip the creator", async () => {
//         const name = "Grace"
//         const message = "You are amazing!"

//         const profileBalanceBefore = await provider.connection.getBalance(profilePDA)

//         await program.methods
//           .supportCreator(new anchor.BN(coinValue), name, message)
//           .accounts({
//             supporter: supporter.publicKey,
//             profile: profilePDA
//           })
//           .signers([supporter]).rpc()

//         const supporterPDAs = await program.account.supporter.all()
//         const supporterInfo = supporterPDAs[0].account

//         assert.equal(supporterPDAs.length, 1)
//         assert(supporterInfo.supporter.equals(supporter.publicKey))
//         assert(supporterInfo.tip.eq(coinValue))
//         assert.equal(supporterInfo.name, name)
//         assert.equal(supporterInfo.message, message)

//         const profileBalanceAfter = await provider.connection.getBalance(profilePDA)

//         const profilePDAs = await program.account.profile.all()
//         const profile = profilePDAs[0].account

//         assert.equal(profileBalanceAfter, profileBalanceBefore + Number(coinValue))
//         assert(profile.fund.eq(coinValue))
//         assert.equal(profile.supporterCount, 1)
//       })

//       it("should withdraw funds", async () => {
//         const profileBefore = (await program.account.profile.all())[0].account
//         assert(profileBefore.fund.eq(coinValue))

//         await program.methods
//           .withdrawCoins()
//           .accounts({ creator: creator.publicKey })
//           .signers([creator])
//           .rpc()

//         const profileAfter = (await program.account.profile.all())[0].account
//         assert(profileAfter.fund.eq(new anchor.BN(0)))
//       })
//     })


//   })
// });