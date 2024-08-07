import { StoreBase } from "./StoreBase";
import { PV1 } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";

/**
 * Represents a class for storing PV1 segment fields.
 * @extends StoreBase
 */
export class StorePV1 extends StoreBase {
    /**
     * Constructor for StorePV1 class.
     * @param {PV1} segmentInstance - Instance of the PV1 segment.
     */
    constructor(segmentInstance) {
        if (segmentInstance instanceof PV1) {
            super(segmentInstance, 'PV1');
            this._setSID(segmentInstance.SetIdPv1?.toString());
        } else {
            throw new Error(`Not a valid Instance of PV1 Segment !!`);
        }
    }

    prepareSegmentFields() {
        this.setCWEFields(['PatientClass', 'AdmissionType', 'AccountStatus','DischargeDisposition','AdmitSource','PatientType','HospitalService']);
        this.setCXFields(['VisitNumber']);
        this.setXCNFields(['AttendingDoctor', 'ReferringDoctor', 'AdmittingDoctor']);
        this.setPLFields(['PriorPatientLocation','TemporaryLocation']);
        let segmentData = {
            pv_admit_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance.AdmitDateTime),
            pv_discharge_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance.DischargeDateTime?.[0])
        };
        this.storeSegmentFields(segmentData);
    }
}
