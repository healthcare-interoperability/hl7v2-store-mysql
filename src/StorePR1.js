import { StoreBase } from "./StoreBase";
import { PR1 } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";

export class StorePR1 extends StoreBase {
  constructor(segmentInstance) {
    if (segmentInstance instanceof PR1) {
      super(segmentInstance, 'PR1');
    } else {
      throw new Error(`Not a valid Instance of PR1 Segment !!`)
    }
  }

  prepareSegmentFields() {
    this.setCWEFields(['ProcedureCode', 'ProcedureFunctionalType', 'AnesthesiaCode', 'AssociatedDiagnosisCode', 'ProcedureCodeModifier']);
    this.setXCNFields(['Surgeon', 'Anesthesiologist']);

    let segmentData = {
      procedure_description: this.segmentInstance.ProcedureDescription?.toString() || null,
      procedure_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance.ProcedureDateTime),
      procedure_minutes: this.segmentInstance.ProcedureMinutes?.toString() || null,
      procedure_anesthesia_minutes: this.segmentInstance.AnesthesiaMinutes?.toString() || null
    };

    this.storeSegmentFields(segmentData);
  }
}