use anchor_lang::prelude::*;

use crate::{
    utils::errors::ProfileError,
    utils::events::UpdateCoinValueEvent,
    states::{Profile, PROFILE_SEED},
};

pub fn update_coin_value(ctx: Context<UpdateCoinValue>, value: u64) -> Result<()> {
    let profile = &mut ctx.accounts.profile;

    require!(
        ctx.accounts.creator.key() == profile.creator,
        ProfileError::Unauthorized
    );
    require!(value > 0, ProfileError::InvalidCoinValue);

    profile.coin_value = value;

    emit!(UpdateCoinValueEvent {
        profile: profile.key(),
        coin_value: value,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateCoinValue<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    #[account(
        mut,
        seeds = [PROFILE_SEED.as_bytes(), creator.key().as_ref()],
        bump
    )]
    profile: Account<'info, Profile>,
}