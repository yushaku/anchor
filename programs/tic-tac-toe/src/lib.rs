use anchor_lang::prelude::*;
use instructions::*;
use state::game::Tile;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("DSd2V8YdXj6D4dG1GqRPuX3wieJacT4zxgKjYNerEL2y");

#[program]
pub mod tic_tac_toe {
    //import everything that's from outside of this scope
    use super::*;

    /*
     * @param ctx: Context. Every fn in Anchor takes this as the first parameter
     * */
    pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
        instructions::setup_game::setup_game(ctx, player_two)
    }

    pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
        instructions::play::play(ctx, tile)
    }
}
