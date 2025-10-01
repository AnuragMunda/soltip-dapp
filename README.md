# Project Description

**Deployed Frontend URL:** [SOLTIP DApp](https://soltip-dapp.vercel.app/)

**Solana Program ID:** 9UXhm3zakFtqXYYgEuT2VQhhp7ots23N52PHKxynFCZ9

## Project Overview

### Description

"SolTip" is a decentralized application on the Solana blockchain that enables creators, project owners, or anyone with a Solana wallet to receive support through crypto-based tips, similar to “Buy Me a Coffee” but leveraging blockchain technology. Upon visiting a creator’s page, supporters can connect their Solana wallet, enter the amount and send funds directly to the recipient’s on-chain profile, which is managed through a secure Program Derived Address (PDA). The platform supports anonymous and public tipping as well as messages, displays a live history of support transactions and messages, and ensures all funds remain non-custodial—meaning the app never takes control of users' money. Through a user-friendly interface powered by Next.js and solana/web3, "SolTip" provides seamless wallet integration, instant transaction feedback, and on-chain transparency, making it an efficient tool for creators to accept real-time, verifiable support on Solana while maintaining privacy, security.

### Key Features

- Wallet Integration: Users can securely connect their Solana wallets (such as Phantom, Backpack, or Solflare) for authentication and easy transaction signing, ensuring a smooth onboarding and tipping process
- Profile Detection and Management: The app automatically detects if a user has an on-chain Solana profile (PDA) and allows creation if it does not exist, streamlining participation for both supporters and recipients
- Send Tips (Buy a Coin): Supporters can tip creators by entering the desired amount coins they wanna send, and optionally leaving a public or private message, all in a single, intuitive flow.
- On-Chain Transactions and Transparency: The dApp displays a live feed of recent support transactions, showing details like supporter names (if public), amounts sent, and messages to enhance social proof and engagement.
- Profile updation: Users can easily update their profiles and set the value of the coin, i.e., what would be the worth of one coin. And the supporters can the enter the amount of coins to buy for the creator.
- Fund withdrawal: There's option for the creator to retrieve the accumulated fund.
  
### How to Use the dApp

1. **Connect Wallet**
2. **Create Profile:** In the home page, there will be a button to create profile. Click on it. It will take you to create profile page.
3. **Fill Form and Submit:** Fill in the information, and the fit the create button. This will validat and redirect to profile page once profile creation is done.
4. **Profile Page:** You will be redirected to profile page after creating it. You can notice that the header now has a navigation for Profile. In this page, on the left panel you can see you information, a button to copy profile link, edit profile, and list of supporters. On the right panel, you can see your vault, the fund available in your profile along with a withdraw button. Below that, you will notice an option to set the value of your coin in sol. Just like in "Buy me a coffee", there's a price attached to the coffee and people can buy as much coffee they like for the creator, and the total tip amount will result to number of coffee * price of one coffee, SolTip has the same mechanism. You can set the price of the coin and the supporter can chose the amount of coin to donate, which will result in total tip amount to be total coin * value of one coin. Default and minimum value is, 0.0001 SOL.
5. **Tipping the creator:** Choose a different account from you Solana wallet. Make sure you have balance. After changing the account you'll see that the interface will change for you a bit, as you are no longer the owner of the profile. In the left panel you'll see some fields for supporting the creator. Fill in the amount of coin (in positive integer), name and message is optional. Total amount will be shown in the button below, click the button
6. **UI update:** Wait for the transaction to happen. Once done, you can see you info in the list of supporters.
7. **Withdraw funds:** Change the account to the creator's account. Now in the left panel, hit the withdraw button. All the funds will be transferred from your profile to your wallet. For every transaction succession, a toast appears at the top with a link to explorer that you will navigate you to the transaction info in the explorer.

## Program Architecture

### Program Architecture Overview
- The program centers on a primary on-chain profile account (PDA) for each creator, along with auxiliary accounts for recording tips and maintaining on-chain state. By utilizing Anchor’s macros and IDL, the program enforces robust security, strict account constraints, and straightforward serialization for client integration.

### Main Instructions
- **Initialize Profile:**
Creates a new profile PDA for a creator. It stores essential details such as display name, bio, avatar/link, and the defined value for “one coin.” Initialization is only permitted if the profile doesn’t already exist for the user’s wallet.

- **Update Profile:**
Allows the profile owner to modify their on-chain metadata (name, bio, avatar, or coin value). This instruction is restricted to the wallet that created the profile PDA to prevent unauthorized changes.

- **Tip (Send Coin):**
Handles receiving a tip. It transfers SOL or SPL tokens from the supporter to the creator’s profile account, records the transaction on-chain (including amount, supporter’s address, message, and timestamp), and may optionally emit an event or update a tip history account.

- **Withdraw Earnings:**
Enables the creator (profile owner) to withdraw accumulated SOL or SPL tokens from their profile account to their external wallet, ensuring self-custody of funds with on-chain accounting.

### Data Flow

**Profile Creation:**
When a user initializes a profile, the program derives a unique PDA, saves the supplied metadata and “coin” value, and emits a creation event.

**Tipping:**
Supporter connects their wallet and triggers a tip. The program:

- Validates the profile PDA exists for the recipient.
- Transfers the specified amount (SOL or SPL) into the recipient’s vault/account.
- Records the transaction—updating earnings and writing a tip entry (if using tip logs).
- Emits an event for off-chain UI updates.

**Profile Update:**
The creator submits changes. The program checks wallet authority, updates the PDA data, and emits an update event.

**Withdrawal:**
The creator triggers a withdrawal. The program verifies authority, checks available balance, and transfers tokens from the program-vault to the creator’s wallet.

### PDA Usage

- For the **Profile** account, the PDA is derived using the static seed string PROFILE_SEED combined with the creator’s public key as seeds:
```rust
seeds = [PROFILE_SEED.as_bytes(), creator.key().as_ref()]
```
This choice guarantees that each creator’s profile has a unique, reproducible on-chain address tied directly to their wallet, preventing collisions and ensuring authority. The static seed (PROFILE_SEED) namespaces this kind of account distinctly from others the program may use.

- For the Supporter account, the PDA seeds are a combination of:
```rust
seeds = [
  SUPPORTER_SEED.as_bytes(), 
  profile.creator.key().as_ref(), 
  supporter.key().as_ref(), 
  &profile.supporter_count.to_le_bytes()
]
```
Here, SUPPORTER_SEED distinguishes supporter records from profiles, while including both the creator’s and the supporter’s public keys ensures the supporter account is unique to that creator-supporter pair. The profile.supporter_count (converted to little-endian bytes) acts as a nonce to allow multiple supporter records even for the same pair or enforce uniqueness for incrementing supporters, helping maintain an ordered or indexed structure.

**PDAs Used:**

- Profile Account:
Store creator’s profile and tipping configuration. Deterministically derived using [PROFILE_SEED, creator pubkey], this account holds the creator’s metadata (name, bio, avatar, email), tip fund balance, coin value, and supporter count. It uniquely represents each creator on-chain and is used as the tipping destination.

- Supporter Account:
Track individual tipping/supporter records. Uniquely derived via [SUPPORTER_SEED, creator pubkey, supporter pubkey, supporter_count]; it records each supporter’s tip along with optional name/message. This account ties a supporter’s contribution to a specific creator, along with tip amount and personalized message.

### Program Instructions

**Instructions Implemented:**

- initialize_creator_profile:
Creates a new profile PDA for a creator. This instruction sets up the creator’s profile on-chain by initializing metadata fields such as name, email, bio, and about-me, assigns the creator’s public key, and sets a default coin value. It ensures a profile cannot be initialized twice for the same creator, and emits an event for profile creation.

- update_creator_profile:
Allows the profile owner to update their metadata fields (name, email, bio, about-me) on-chain. Only the profile’s creator can call this function, and at least one field must be provided for update. The instruction ensures profile information remains current and emits an update event.

- update_coin_value:
Enables the creator to change the value that defines what “one coin” is worth for their profile. Only the owner (creator) can update this, and the new value must be positive. This enables creators to set or adjust the tipping denomination as needed, with every change emitting an event to log on-chain state.

- tip_creator:
Allows a supporter to send a tip to a creator’s profile. It transfers the specified amount of SOL from the supporter’s wallet to the profile account, creates or updates a supporter record with an optional name and message, increments the supporter count, and logs the transaction via an event. This is the core support workflow of the dApp, facilitating on-chain micropayments along with personalized supporter messages.

- withdraw_funds:
Permits the creator to withdraw accumulated funds (SOL) from their profile account to their personal wallet. This can only be executed by the profile owner, and only if there is a positive balance. After transferring the funds, the profile balance is reset to zero and a withdrawal event is emitted for transparency.

- close_creator_profile:
Closes and deletes the creator’s profile account, transferring all remaining SOL to the creator’s main wallet. Only the creator can perform this action. Closing the profile removes all stored metadata from the blockchain and emits an event to indicate the account closure and amount transferred.

### Account Structure

```rust
#[account]
#[derive(InitSpace)]
pub struct Profile {
    /// The wallet address of the creator (profile owner).
    pub creator: Pubkey,

    /// Creator’s display name, max length enforced.
    #[max_len(NAME_LENGTH)]
    pub name: String,

    /// Creator’s email address, max length enforced.
    #[max_len(EMAIL_LENGTH)]
    pub email: String,

    /// A short bio or description for the creator.
    #[max_len(BIO_LENGTH)]
    pub bio: String,

    /// A detailed 'about me' section for rich profile content.
    #[max_len(ABOUT_ME_LENGTH)]
    pub about_me: String,

    // /// (Optional) Social/media links field could be added here.
    // #[max_len(MAX_SOCIAL_LINKS, SOCIAL_LINK_LENGTH)]
    // pub social_links: Vec<String>,

    /// Unwithdrawn lamports (SOL) balance received via tips.
    pub fund: u64,

    /// The value (in lamports) representing one 'coin' for tipping.
    pub coin_value: u64,

    /// Total number of unique supporter tips this creator has received.
    pub supporter_count: u32,
}
```
```rust
#[account]
#[derive(InitSpace)]
pub struct Supporter {
    /// Unique identifier for this supporter record, typically index.
    pub id: u32,

    /// The creator’s wallet address this tip is associated with.
    pub creator: Pubkey,

    /// The supporter’s wallet address.
    pub supporter: Pubkey,

    /// (Optional) Display name for the supporter.
    #[max_len(SUPPORTER_NAME_LENGTH)]
    pub name: Option<String>,

    /// Amount tipped (in lamports or tokens).
    pub tip: u64,

    /// (Optional) Message the supporter attaches with their tip.
    #[max_len(MESSAGE_LENGTH)]
    pub message: Option<String>,
}

```

## Testing

### Test Coverage

For testing, the approach combines both “happy path” (valid workflow) and “unhappy path” (error scenario) cases using the Anchor framework’s TypeScript test suite. Each test initializes relevant accounts, simulates real wallet actions, and asserts both on-chain state changes and error handling.

**Happy Path Tests:**
- Test 1: Creator profile initialization — Ensures a creator can initialize their profile with valid data, and that all field values are saved and accessible as expected.
- Test 2: Profile update — Verifies the creator can update their profile metadata with both all and some fields, preserving unchanged data when fields are omitted.
- Test 3: Set coin value — Confirms a creator can set or change the denomination for “one coin” and that this value updates on-chain.
- Test 4: Tipping support — Simulates a supporter sending a tip with a name and message, verifying supporter record creation, fund transfer, profile supporter count, and message logging.
- Test 5: Withdraw funds — Validates a creator can withdraw accumulated funds from their profile, resetting the profile’s fund balance to zero.
- Test 6: Profile close — Ensures that closing a profile transfers the account’s lamports to the creator and deletes profile data.

**Unhappy Path Tests:**
- Test 1: Unauthorized profile update — Attempts to update a profile with a wallet other than the creator, expecting a ProfileError::Unauthorized failure.
- Test 2: Invalid coin value — Tries to set the coin value to zero or a negative number, expecting a ProfileError::InvalidCoinValue error.
- Test 3: Double initialization — Attempts to initialize a profile when one already exists for the creator, validating correct error and data protection.
- Test 4: Withdraw with no funds — Attempts a withdrawal from a profile with a fund balance of zero, expecting a ProfileError::InsufficientFunds.
- Test 5: Update with no fields — Attempts to update a profile without providing any new field, expecting a ProfileError::NoArgumentProvided.

### Running Tests
```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

[TODO: Add any specific notes or context that would help evaluators understand your project better]