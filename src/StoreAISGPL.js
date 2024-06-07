import { AIG, AIL, AIS, AIP } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";
import { StoreBase } from "@healthcare-interoperability/hl7v2-store-mysql";
import { TypeCastCWE } from '@healthcare-interoperability/hl7v2-typecast';

export class StoreAISGPL extends StoreBase {
    constructor(segmentInstance) {
        let type, setId;
        let CWEFields = [];
        let PLFields = [];
        let XCNFields = [];

        switch (true) {
            case segmentInstance instanceof AIG:
                type = 'AIG';
                setId = segmentInstance.SetIdAig;
                CWEFields = ['ResourceId', 'ResourceType', 'ResourceGroup'];
                break;
            case segmentInstance instanceof AIL:
                type = 'AIL';
                setId = segmentInstance.SetIdAil;
                PLFields = ['LocationResourceId'];
                CWEFields = ['LocationType', 'LocationGroup'];
                break;
            case segmentInstance instanceof AIP:
                type = 'AIP';
                setId = segmentInstance.SetIdAip;
                XCNFields = ['PersonnelResourceId'];
                CWEFields = ['ResourceType', 'ResourceGroup'];
                break;
            case segmentInstance instanceof AIS:
                type = 'AIS';
                setId = segmentInstance.SetIdAis;
                break;
            default:
                throw new Error('Unsupported segment instance type');
        }

        super(segmentInstance, type);
        this._setSID(setId?.toString());

        this.setCWEFields(CWEFields);
        this.setXCNFields(XCNFields);
    }

    prepareUnits(units) {
        try {
            if (units) {
                let typecastedUnit = new TypeCastCWE(units).typecast();
                return typecastedUnit.Identifier?.toString();
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    prepareSegmentFields() {
        this.setCWEFields(['FillerStatusCode']);
        let segmentData = {
            ai_segment_action_code: this.segmentInstance.SegmentActionCode?.toString(),
            ai_start_date_time: HL7v2MySQLUtils.validateDTM(this.segmentInstance.StartDateTime),
            ai_start_date_time_offset: this.segmentInstance.StartDateTimeOffset?.toString() ?? null,
            ai_start_date_time_offset_units: this.prepareUnits(this.segmentInstance.StartDateTimeOffsetUnits),
            ai_duration: this.segmentInstance.Duration?.toString() ?? null,
            ai_duration_units: this.prepareUnits(this.segmentInstance.DurationUnits)
        };
        this.storeSegmentFields(segmentData);
    }
}