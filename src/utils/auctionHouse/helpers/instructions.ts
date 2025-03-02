import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction,
  } from '@solana/web3.js';
  import {
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    TOKEN_METADATA_PROGRAM_ID,
    METAPLEX_PROGRAM_ID,
  } from './constants';
  import * as anchor from '@project-serum/anchor';
  import {Token} from "@solana/spl-token";
  
  export async function createAssociatedTokenAccount(wallet: PublicKey, mint: PublicKey, associatedTokenAddress: PublicKey) {
    return createAssociatedTokenAccountInstruction(associatedTokenAddress,
      wallet,
      wallet,
      mint);
  }
  
  export function getTransferInstructions(source: PublicKey, destination: PublicKey, owner: PublicKey) {
    return Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      source,
      destination,
      owner,
      [],
      1
    )
  }
  
  export function createAssociatedTokenAccountInstruction(
    associatedTokenAddress: PublicKey,
    payer: PublicKey,
    walletAddress: PublicKey,
    splTokenMintAddress: PublicKey,
  ) {
    const keys = [
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: associatedTokenAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: walletAddress,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: splTokenMintAddress,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new TransactionInstruction({
      keys,
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([]),
    });
  }
  
  export function createMetadataInstruction(
    metadataAccount: PublicKey,
    mint: PublicKey,
    mintAuthority: PublicKey,
    payer: PublicKey,
    updateAuthority: PublicKey,
    txnData: Buffer,
  ) {
    const keys = [
      {
        pubkey: metadataAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: mintAuthority,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: updateAuthority,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new TransactionInstruction({
      keys,
      programId: TOKEN_METADATA_PROGRAM_ID,
      data: txnData,
    });
  }
  
  export function createMasterEditionInstruction(
    metadataAccount: PublicKey,
    editionAccount: PublicKey,
    mint: PublicKey,
    mintAuthority: PublicKey,
    payer: PublicKey,
    updateAuthority: PublicKey,
    txnData: Buffer,
  ) {
  
    const keys = [
      {
        pubkey: editionAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: updateAuthority,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: mintAuthority,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: metadataAccount,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new TransactionInstruction({
      keys,
      programId: TOKEN_METADATA_PROGRAM_ID,
      data: txnData,
    });
  }
  
  export function createUpdateMetadataInstruction(
    metadataAccount: PublicKey,
    payer: PublicKey,
    txnData: Buffer,
  ) {
    const keys = [
      {
        pubkey: metadataAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: payer,
        isSigner: true,
        isWritable: false,
      },
    ];
    return new TransactionInstruction({
      keys,
      programId: TOKEN_METADATA_PROGRAM_ID,
      data: txnData,
    });
  }
  
  async function deriveMetadataAccount(mint: PublicKey): Promise<PublicKey> {
    const metadataSeeds = [
      Buffer.from("metadata"),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ];
    const [metadataAccount, _pda] = await PublicKey.findProgramAddress(
      metadataSeeds,
      METAPLEX_PROGRAM_ID
    );
    return metadataAccount;
  }