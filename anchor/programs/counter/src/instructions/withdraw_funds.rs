use anchor_lang::prelude::*;
use crate::{
    utils::errors::ProfileError,
    states::{Profile, PROFILE_SEED},
    utils::events::WithdrawFundEvent
};

pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let creator = &ctx.accounts.creator;
    let creator_key = creator.key();
    let lamports = profile.fund;

    require!(creator_key == profile.creator, ProfileError::Unauthorized);
    require!(lamports > 0, ProfileError::InsufficientFunds);

    **profile.to_account_info().try_borrow_mut_lamports()? -= lamports;
    **creator.to_account_info().try_borrow_mut_lamports()? += lamports;

    profile.fund = 0;

    emit!(WithdrawFundEvent {
        profile: profile.key(),
        amount: lamports
    });
    
    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    #[account(
        mut,
        seeds = [PROFILE_SEED.as_bytes(), creator.key().as_ref()],
        bump
    )]
    profile: Account<'info, Profile>,
}