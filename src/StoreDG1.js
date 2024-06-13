import { StoreBase } from "./StoreBase";
import { DG1 } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";

export class StoreDG1 extends StoreBase {
    constructor(segmentInstance) {
      if (segmentInstance instanceof DG1) {
        super(segmentInstance, 'DG1');
        this._setSID(segmentInstance.SetIdDg1?.toString());
      } else {
        throw new Error(`Not a valid Instance of DG1 Segment !!`)
      }
    }
  
    prepareEntityIdentifier(entInt) {
      try {
        return entInt?.EntityIdentifier?.toString();
      } catch (e) {
        console.log(e);
      }
      return null;
    }
  
    prepareSegmentFields() {
      this.setCWEFields(['DiagnosisCodeDg1', 'DiagnosisType', 'DiagnosisClassification']);
      this.setXCNFields(['DiagnosingClinician'])
      let segmentData = {
        diag_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance.DiagnosisDateTime),
        diag_description: HL7v2MySQLUtils.validateString(this.segmentInstance.DiagnosisDescription),
        diag_attest_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance.AttestationDateTime),
        diag_identifier: this.prepareEntityIdentifier(this.segmentInstance.DiagnosisIdentifier),
      };
      this.storeSegmentFields(segmentData);
    }
  }