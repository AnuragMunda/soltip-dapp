use anchor_lang::prelude::*;

use crate::{
    utils::errors::ProfileError,
    utils::events::UpdateProfileEvent,
    states::{Profile, PROFILE_SEED},
};

pub fn update_creator_profile(
    ctx: Context<UpdateCreatorProfile>,
    name: Option<String>,
    email: Option<String>,
    bio: Option<String>,
    about_me: Option<String>,
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let creator_key = ctx.accounts.creator.key();

    require!(creator_key == profile.creator, ProfileError::Unauthorized);
    require!(
        name.is_some() || email.is_some() || bio.is_some() || about_me.is_some(),
        ProfileError::NoArgumentProvided
    );

    profile.validate_and_update(name, email, bio, about_me)?;

    emit!(UpdateProfileEvent {
        profile: profile.key(),
        creator: creator_key,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateCreatorProfile<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    #[account(
        mut,
        seeds = [PROFILE_SEED.as_bytes(), creator.key().as_ref()],
        bump
    )]
    profile: Account<'info, Profile>,
}