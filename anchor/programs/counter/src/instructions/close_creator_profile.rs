use anchor_lang::prelude::*;

use crate::{utils::events::CloseProfileEvent, states::profile::*};

pub fn close_creator_profile(ctx: Context<CloseCreatorProfile>) -> Result<()> {
    let creator = &ctx.accounts.creator;
    let sol = ctx.accounts.profile.get_lamports();
    ctx.accounts.profile.close(creator.to_account_info())?;

    emit!(CloseProfileEvent {
        creator: creator.key(),
        sol_transferred: sol,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct CloseCreatorProfile<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    #[account(
        mut,
        seeds = [PROFILE_SEED.as_bytes(), creator.key().as_ref()],
        bump,
    )]
    pub profile: Account<'info, Profile>,

    pub system_program: Program<'info, System>,
}