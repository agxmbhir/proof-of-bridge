//@ts-ignore
import { Block, require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Event, BigInt } from "@hyperoracle/zkgraph-lib";

const esigBurn = "0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5";
const esigBurnU32 = BigInt.fromString(esigBurn.slice(0, 8)).toU32();

let mintIdentifier = "6bc63893";
let mintIdentifierBytes = Bytes.fromHexString(mintIdentifier).padEnd(32);

export function handleBlocks(blocks: Block[]): Bytes {
  let events = blocks[0].events;
  let burnAmount: Bytes = Bytes.fromHexString("0x"); // User's amount;
  let burnAddress: Bytes = Bytes.fromHexString("0x"); // User's address;
  let noEvent = true;

  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].esig.toU32() == esigBurnU32) {
      //   console.log('SYNC event');
      burnAddress = events[i].data.slice(0, 32);
      burnAmount = events[i].data.slice(32, 64);
      noEvent = false;
      break;
    }
  }
  if (noEvent) {
    require(false);
    return Bytes.empty(); // Omit compile error, never goes here
  } else {
    let payload = burnAddress.concat(burnAmount);
    return Bytes.fromByteArray(mintIdentifierBytes.concat(payload));
  }
}
