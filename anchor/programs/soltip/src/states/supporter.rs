use anchor_lang::prelude::*;

use crate::utils::errors::SupporterError;

pub const SUPPORTER_NAME_LENGTH: usize = 50;
pub const MESSAGE_LENGTH: usize = 300;

pub const SUPPORTER_SEED: &str = "SUPPORTER";

#[account]
#[derive(InitSpace)]
pub struct Supporter {
    id: u32,
    creator: Pubkey,
    supporter: Pubkey,
    #[max_len(SUPPORTER_NAME_LENGTH)]
    name: Option<String>,
    tip: u64,
    #[max_len(MESSAGE_LENGTH)]
    message: Option<String>,
}

impl Supporter {
    pub fn validate(
        &self,
        amount: u64,
        name: Option<String>,
        message: Option<String>,
    ) -> Result<()> {
        require!(amount > 0, SupporterError::InvalidAmount);

        if let Some(name) = name {
            require!(
                name.len() <= SUPPORTER_NAME_LENGTH,
                SupporterError::NameTooLong
            );
        }
        if let Some(message) = message {
            require!(
                message.len() <= MESSAGE_LENGTH,
                SupporterError::MessageTooLong
            );
        }
        Ok(())
    }

    pub fn set(
        &mut self,
        id: u32,
        creator: Pubkey,
        supporter: Pubkey,
        amount: u64,
        name: Option<String>,
        message: Option<String>,
    ) -> Result<()> {
        self.id = id;
        self.creator = creator;
        self.supporter = supporter;
        self.tip = amount;

        if let Some(name) = name {
            self.name = Some(name);
        }
        if let Some(message) = message {
            self.message = Some(message);
        }

        Ok(())
    }
}