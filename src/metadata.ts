import { Bytes, dataSource, json } from "@graphprotocol/graph-ts";
import { TokenMetadata } from "../generated/schema";

export function handleMetadata(content: Bytes): void {
  let tokenMetadata = new TokenMetadata(
    String.UTF8.decode(dataSource.address().buffer)
  );

  const value = json.fromBytes(content).toObject();
  if (value) {
    const image = value.get("image");
    const name = value.get("name");
    const description = value.get("description");
    const externalURL = value.get("external_url");
    if (name && image && description && externalURL) {
      tokenMetadata.name = name.toString();
      tokenMetadata.image = image.toString();
      tokenMetadata.externalURL = externalURL.toString();
      tokenMetadata.description = description.toString();
    }
    tokenMetadata.save();
  }
}
