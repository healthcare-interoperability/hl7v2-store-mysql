import { StoreBase } from "./StoreBase";
import { PID } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";

/**
 * Represents a class for storing PID segment fields.
 * @extends StoreBase
 */
export class StorePID extends StoreBase {
    /**
     * Constructor for StorePID class.
     * @param {PID} segmentInstance - Instance of the PID segment.
     */
    constructor(segmentInstance) {
        if (segmentInstance instanceof PID) {
            super(segmentInstance, 'PID');
            this._setSID(segmentInstance.SetIdPid?.toString());
        } else {
            throw new Error(`Not a valid Instance of PID Segment !!`);
        }
    }

    prepareSegmentFields(){
        this.setCWEFields(['AdministrativeSex', 'Race', 'PrimaryLanguage', 'MaritalStatus', 'Religion', 'EthnicGroup']);
        this.setCXFields(['PatientId', 'PatientIdExternalId', 'PatientIdentifierList', 'AlternatePatientId', 'PatientAccountNumber']);
        this.setXCNFields(['PatientName', 'MotherSMaidenName']);
        this.setXADFields(['PatientAddress']);
        this.setXTNFields(['PatientTelecommunicationInformation']);
        let segmentData = {
            pid_dob: HL7v2MySQLUtils.validateDTM(this.segmentInstance?.DateOfBirth),
            pid_multiple_birth: this.segmentInstance?.MultipleBirthIndicator?.toString() || null,
            pid_dodeath: HL7v2MySQLUtils.validateDTM(this.segmentInstance?.PatientDeathDateAndTime),
            pid_death_indicator: this.segmentInstance?.PatientDeathIndicator?.toString() || null,
            pid_ssn: this.segmentInstance?.SSNNumberPatient?.toString() || null,
            pid_dl_no: HL7v2MySQLUtils.prepareComplexData(this.segmentInstance?.DriversLicenseNumberPatient)
        };
        this.storeSegmentFields(segmentData);
    }
}
