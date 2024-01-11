//@ts-ignore
import { Block, ByteArray, require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Event, BigInt } from "@hyperoracle/zkgraph-lib";

const esigBurn = Bytes.fromHexString("0x42966c689b5afe9b9b3f8a7103b2a19980d59629bfd6a20a60972312ed41d836");
const zeroAddress = Bytes.fromHexString('0x0000000000000000000000000000000000000000000000000000000000000000')


let mintIdentifier = "6bc63893";
let mintIdentifierBytes = Bytes.fromHexString(mintIdentifier).padEnd(32);

export function handleBlocks(blocks: Block[]): Bytes {
  let events = blocks[0].events;
  let burnEvent: Event | null = null;
  for (let i = 0; i < events.length; i++) {
    if (events[i].topic2 == zeroAddress) {
      burnEvent = events[i]
      break;
    }
  }
  let payload: ByteArray = new ByteArray(0); // Initialize payload as an empty array
  if (burnEvent) {
    let burnAddress = burnEvent.topic1;
    let burnAmount = burnEvent.data;
    payload = burnAddress.concat(burnAmount);
  }
  return Bytes.fromByteArray(mintIdentifierBytes.concat(Bytes.fromByteArray(payload)));
}

