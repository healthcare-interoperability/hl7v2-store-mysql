import { StoreBase } from "./StoreBase";
import { IN1 } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";

/**
 * Represents a class for storing IN1 segment fields.
 * @extends StoreBase
 */
export class StoreIN1 extends StoreBase {
    /**
     * Constructor for StoreIN1 class.
     * @param {IN1} segmentInstance - Instance of the IN1 segment.
     */
    constructor(segmentInstance) {
        if (segmentInstance instanceof IN1) {
            super(segmentInstance, 'IN1');
            this._setSID(segmentInstance.SetIdInsurance?.toString());
        } else {
            throw new Error(`Not a valid Instance of IN1 Segment !!`)
        }
    }

    prepareSegmentFields(){
        this.setCWEFields(['InsurancePlanId']);
        this.setCXFields(['InsuranceCompanyId']);
        this.setXCNFields(['NameOfInsured']);
        this.setXADFields(['InsuranceCompanyAddress'])
        let segmentData = {
            ins_group_number: this.segmentInstance.GroupNumber?.toString(),
            ins_plan_effective_date: HL7v2MySQLUtils.validateDTM(this.segmentInstance.PlanEffectiveDate),
            ins_plan_expiration_date: HL7v2MySQLUtils.validateDTM(this.segmentInstance.PlanExpirationDate),
            ins_plan_type: HL7v2MySQLUtils.validateString(this.segmentInstance.PlanType),
            ins_insured_dob: HL7v2MySQLUtils.validateDTM(this.segmentInstance.InsuredSDateOfBirth),
            ins_verification_datetime: HL7v2MySQLUtils.validateDTM(this.segmentInstance.VerificationDateTime),
            ins_policy_number: HL7v2MySQLUtils.validateString(this.segmentInstance.PolicyNumber),
            ins_coverage_type: HL7v2MySQLUtils.validateString(this.segmentInstance.CoverageType),
            ins_billing_status: HL7v2MySQLUtils.validateString(this.segmentInstance.BillingStatus)
        };
        this.storeSegmentFields(segmentData);
    }
}
