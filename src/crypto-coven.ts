import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  CryptoCoven,
  Transfer as TransferEvent,
} from "../generated/CryptoCoven/CryptoCoven";
import { Token, Transfer } from "../generated/schema";
import { TokenMetadata as TokenMetadataTemplate } from "../generated/templates";

// const ipfshash = "QmaXzZhcYnsisuue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm";

function getOrCreateToken(tokenId: BigInt, address: Address): Token {
  let id = Bytes.fromI32(tokenId.toI32());
  let token = Token.load(id);

  if (!token) {
    let instance = CryptoCoven.bind(address);
    token = new Token(id);

    token.uri = instance.tokenURI(tokenId);

    token.tokenURI = "/" + tokenId.toString() + ".json";

    // const tokenIpfsHash = ipfshash + token.tokenURI!;

    const tokenIpfsHash = token.uri!.replace("ipfs://", "");
    token.ipfsURI = tokenIpfsHash;

    TokenMetadataTemplate.create(tokenIpfsHash);

    token.save();
  }

  return token;
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  getOrCreateToken(entity.tokenId, event.address);

  entity.save();
}
