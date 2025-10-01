use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    utils::events::SupportCreatorEvent,
    states::{supporter::*, Profile},
};

pub fn tip_creator(
    ctx: Context<TipCreator>,
    amount: u64,
    name: Option<String>,
    message: Option<String>,
) -> Result<()> {
    let program = ctx.accounts.system_program.to_account_info();
    let supporter = &ctx.accounts.supporter;
    let profile = &mut ctx.accounts.profile;

    ctx.accounts
        .supporter_account
        .validate(amount, name.clone(), message.clone())?;

    let cpi_context = CpiContext::new(
        program,
        Transfer {
            from: supporter.to_account_info(),
            to: profile.to_account_info(),
        },
    );

    transfer(cpi_context, amount)?;

    ctx.accounts
        .supporter_account
        .set(profile.supporter_count, profile.creator, supporter.key(), amount, name, message)?;

    profile.fund += amount;
    profile.supporter_count += 1;

    emit!(SupportCreatorEvent {
        creator: profile.creator.key(),
        supporter: supporter.key(),
        amount
    });

    Ok(())
}

#[derive(Accounts)]
pub struct TipCreator<'info> {
    #[account(mut)]
    supporter: Signer<'info>,

    #[account(
        init,
        space = 8 + Supporter::INIT_SPACE,
        payer = supporter,
        seeds = [
            SUPPORTER_SEED.as_bytes(), 
            profile.creator.key().as_ref(), 
            supporter.key().as_ref(), 
            &profile.supporter_count.to_le_bytes()
        ],
        bump
    )]
    supporter_account: Account<'info, Supporter>,

    #[account(mut)]
    profile: Account<'info, Profile>,

    system_program: Program<'info, System>,
}