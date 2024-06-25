import { StoreBase } from "./StoreBase";
import { NTE } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";

export class StoreNTE extends StoreBase {
  constructor(segmentInstance) {
    if (segmentInstance instanceof NTE) {
      super(segmentInstance, 'NTE');
    } else {
      throw new Error(`Not a valid Instance of NTE Segment !!`)
    }
  }

  prepareSegmentFields() {
    this.setCWEFields(['CommentType']);
    this.setXCNFields(['EnteredBy']);

    let segmentData = {
      note_source_of_comment: this.segmentInstance.SourceOfComment?.toString() || null,
      note_comment: this.segmentInstance.Comment?.toString() || null,
      note_entered_date_time: HL7v2MySQLUtils.validateDTM(this.segmentInstance.EnteredDateTime),
      note_effective_date_time: HL7v2MySQLUtils.validateDTM(this.segmentInstance.EffectiveStartDate),
      note_expiration_date_time: HL7v2MySQLUtils.validateDTM(this.segmentInstance.ExpirationDate),
    };

    this.storeSegmentFields(segmentData);
  }
}