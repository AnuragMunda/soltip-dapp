#![allow(clippy::result_large_err)]

use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod utils;
pub mod instructions;
pub mod states;

declare_id!("9UXhm3zakFtqXYYgEuT2VQhhp7ots23N52PHKxynFCZ9");

#[program]
pub mod soltip {
    use super::*;

    pub fn initialize_profile(
        ctx: Context<InitializeCreatorProfile>,
        name: String,
        email: String,
        bio: String,
        about_me: String,
    ) -> Result<()> {
        initialize_creator_profile(ctx, name, email, bio, about_me)
    }

    pub fn update_profile(
        ctx: Context<UpdateCreatorProfile>,
        name: Option<String>,
        email: Option<String>,
        bio: Option<String>,
        about_me: Option<String>,
    ) -> Result<()> {
        update_creator_profile(ctx, name, email, bio, about_me)
    }

    pub fn close_profile(ctx: Context<CloseCreatorProfile>) -> Result<()> {
        close_creator_profile(ctx)
    }

    pub fn set_coin_value(ctx: Context<UpdateCoinValue>, value: u64) -> Result<()> {
        update_coin_value(ctx, value)
    }

    pub fn withdraw_coins(ctx: Context<WithdrawFunds>) -> Result<()> {
        withdraw_funds(ctx)
    }

    pub fn support_creator(
        ctx: Context<TipCreator>,
        amount: u64,
        name: Option<String>,
        message: Option<String>
    ) -> Result<()> {
        tip_creator(ctx, amount, name, message)
    }
}