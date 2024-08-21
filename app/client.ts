import {
  Connection,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import {
  createMint,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const wallet = pg.wallet;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

(async function main() {
  const mint = await createMint(
    connection,
    wallet.keypair, // payer
    wallet.publicKey, // mint authority
    wallet.publicKey, // freeze authority
    9, // decimals
    new Keypair(), // keypair for mint account
    null,
    TOKEN_2022_PROGRAM_ID
  );

  // Derive PDA
  const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
    mint, // mint address
    wallet.publicKey, // token account owner
    false, // allow owner off-curve (PDA)
    TOKEN_2022_PROGRAM_ID
  );

  // Instruction to create associated token account
  const instruction = createAssociatedTokenAccountInstruction(
    wallet.publicKey, // payer
    associatedTokenAccountAddress, // token account address
    wallet.publicKey, // owner
    mint, // mint address
    TOKEN_2022_PROGRAM_ID
  );

  // Create transaction with instruction
  const transaction = new Transaction().add(instruction);

  // Sign and send transaction
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [
      wallet.keypair, // payer
    ]
  );

  console.log(
    "\nTransaction Signature:",
    `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );

  console.log(
    "\nToken Account: ",
    `https://explorer.solana.com/address/${associatedTokenAccountAddress}?cluster=devnet`
  );
})();
