use anchor_lang::prelude::*;

#[event]
pub struct InitializeProfileEvent {
    pub profile: Pubkey,
    pub creator: Pubkey,
}

#[event]
pub struct UpdateProfileEvent {
    pub profile: Pubkey,
    pub creator: Pubkey,
}

#[event]
pub struct CloseProfileEvent {
    pub creator: Pubkey,
    pub sol_transferred: u64,
}

#[event]
pub struct UpdateCoinValueEvent {
    pub profile: Pubkey,
    pub coin_value: u64,
}

#[event]
pub struct WithdrawFundEvent {
    pub profile: Pubkey,
    pub amount: u64,
}

#[event]
pub struct SupportCreatorEvent {
    pub creator: Pubkey,
    pub supporter: Pubkey,
    pub amount: u64,
}