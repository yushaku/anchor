# High-level Overview

An Anchor program consists of three parts.

- #[program] The program module: where you write your business logic,
- #[derive(Accounts)] the Accounts structs: where you validate accounts
- `declare_id` macro: stores the address of your program.

```rust
// import common anchor features
use anchor_lang::prelude::*;

// declare an id for your program
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// write your business logic here
#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

// validate incoming accounts here
#[derive(Accounts)]
pub struct Initialize {}
```

## The Accounts Struct

```rust
#[account]
#[derive(Default)]
pub struct MyAccount {
    data: u64
}


#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>
}
```

_Account_ is generic type, you can create yourself to store data.
We have created a `struct MyAccount` pass it to _Account_ generator.

_Account_ requires _MyAccount_ to implement certain functions (e.g. functions that (de)serialize).
Most of the time, you can use the #[account] attribute to add these functions to your data

- The #[account] attribute sets the owner of that data to the `ID` (the one we created earlier with `declare_id`) of the crate #[account] is used in.

The Account type can then check for you that the `AccountInfo` passed into your instruction has its owner field set to the correct program.

In this example, `MyAccount` is declared in our own crate so Account will verify that the owner of my_account equals the address we declared with declare_id.

## Constraints

```rust
#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,

    #[account(
        constraint = my_account.mint == token_account.mint,
        has_one = owner
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub owner: Signer<'info>
}
```

- Used the `mut` to indicate that `my_account` should be mutable.
- Used `has_one` to check that `token_account.owner == owner.key()`.
- And finally we used constraint to check an arbitrary expression;
  in this case, whether the incoming TokenAccount belongs to the admin mint.
