import { StoreBase } from "./StoreBase";
import { PD1 } from "@healthcare-interoperability/hl7v2-segments";

export class StorePD1 extends StoreBase {
  constructor(segmentInstance) {
    if (segmentInstance instanceof PD1) {
      super(segmentInstance, 'PD1');
    } else {
      throw new Error(`Not a valid Instance of PD1 Segment !!`)
    }
  }

  prepareSegmentFields() {}
}