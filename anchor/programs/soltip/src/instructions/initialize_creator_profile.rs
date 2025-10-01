use anchor_lang::prelude::*;

use crate::{states::profile::*, utils::events::InitializeProfileEvent};

pub fn initialize_creator_profile(
    ctx: Context<InitializeCreatorProfile>,
    name: String,
    email: String,
    bio: String,
    about_me: String,
) -> Result<()> {
    let creator_profile = &mut ctx.accounts.profile;
    let creator_key = ctx.accounts.creator.key();

    creator_profile.creator = creator_key;
    creator_profile.coin_value = 100_000;
        creator_profile.validate_and_update(Some(name), Some(email), Some(bio), Some(about_me))?;

    emit!(InitializeProfileEvent {
        profile: creator_profile.key(),
        creator: creator_key,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeCreatorProfile<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Profile::INIT_SPACE,
        seeds = [PROFILE_SEED.as_bytes(), creator.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,

    pub system_program: Program<'info, System>,
}