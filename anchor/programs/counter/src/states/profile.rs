use anchor_lang::prelude::*;

use crate::utils::errors::ProfileError;

pub const NAME_LENGTH: usize = 30;
pub const BIO_LENGTH: usize = 150;
pub const EMAIL_LENGTH: usize = 64;
pub const ABOUT_ME_LENGTH: usize = 500;
// pub const MAX_SOCIAL_LINKS: usize = 7;
// pub const SOCIAL_LINK_LENGTH: usize = 64;

pub const PROFILE_SEED: &str = "PROFILE";

#[account]
#[derive(InitSpace)]
pub struct Profile {
    pub creator: Pubkey,
    #[max_len(NAME_LENGTH)]
    pub name: String,
    #[max_len(EMAIL_LENGTH)]
    pub email: String,
    #[max_len(BIO_LENGTH)]
    pub bio: String,
    #[max_len(ABOUT_ME_LENGTH)]
    pub about_me: String,
    // #[max_len(MAX_SOCIAL_LINKS, SOCIAL_LINK_LENGTH)]
    // pub social_links: Vec<String>,
    pub fund: u64,
    pub coin_value: u64,
    pub supporter_count: u32,
}

impl Profile {
    pub fn validate_and_update(
        &mut self,
        name: Option<String>,
        email: Option<String>,
        bio: Option<String>,
        about_me: Option<String>,
    ) -> Result<()> {
        if let Some(name) = name {
            require!(name.len() <= NAME_LENGTH, ProfileError::NameTooLong);
            self.name = name;
        }
        if let Some(email) = email {
            require!(email.len() <= EMAIL_LENGTH, ProfileError::EmailTooLong);
            self.email = email;
        }
        if let Some(bio) = bio {
            require!(bio.len() <= BIO_LENGTH, ProfileError::BioTooLong);
            self.bio = bio;
        }
        if let Some(about_me) = about_me {
            require!(
                about_me.len() <= ABOUT_ME_LENGTH,
                ProfileError::AboutMeTooLong
            );
            self.about_me = about_me;
        }
        Ok(())
    }
}