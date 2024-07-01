import { StoreBase } from "./StoreBase";
import { PV2 } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";

export class StorePV2 extends StoreBase {
  constructor(segmentInstance) {
    if (segmentInstance instanceof PV2) {
      super(segmentInstance, 'PV2');
      segmentInstance.ExpectedDischargeDateTime
    } else {
      throw new Error(`Not a valid Instance of PV2 Segment !!`)
    }
  }

  prepareSegmentFields(){
    this.setCWEFields(['AccommodationCode', 'AdmitReason', 'TransferReason','PatientStatusCode']);
    this.setXCNFields(['ReferralSourceCode']);
    this.setPLFields(['PriorPendingLocation','TemporaryLocation']);

    let segmentData = {
      pv_admit_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance?.ExpectedAdmitDateTime),
      pv_discharge_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance?.ExpectedDischargeDateTime),
      pv_description: this.segmentInstance?.VisitDescription?.toString() || null
  };
    this.storeSegmentFields(segmentData);
}
}