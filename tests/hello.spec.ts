import * as anchor from "@coral-xyz/anchor";
import { AnchorError, type Program } from "@coral-xyz/anchor";
import { HelloWorld } from "../target/types/hello_world";
import { expect } from "chai";

describe("Hello world", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;
  const programProvider = program.provider as anchor.AnchorProvider;
  const playerOne = programProvider.wallet;
  const playerTwo = anchor.web3.Keypair.generate();

  it("set up", async () => {
    await program.methods.hello().rpc();
  });
});
