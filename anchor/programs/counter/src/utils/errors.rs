use anchor_lang::prelude::*;

#[error_code]
pub enum ProfileError {
    #[msg("Name exceeds maximum length")]
    NameTooLong,
    #[msg("Email exceeds maximum length")]
    EmailTooLong,
    #[msg("Bio exceeds maximum length")]
    BioTooLong,
    #[msg("About me exceeds maximum length")]
    AboutMeTooLong,
    #[msg("No argument is provided")]
    NoArgumentProvided,
    #[msg("User not authorized to take the action")]
    Unauthorized,
    #[msg("Coin value must be greater than 0")]
    InvalidCoinValue,
    #[msg("No funds available")]
    InsufficientFunds,
}

#[error_code]
pub enum SupporterError {
    #[msg("Name exceeds maximum length")]
    NameTooLong,
    #[msg("Message exceeds maximum length")]
    MessageTooLong,
    #[msg("Amount must be greater than 0")]
    InvalidAmount
}