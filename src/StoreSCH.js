import { StoreBase } from "./StoreBase";
import { SCH } from "@healthcare-interoperability/hl7v2-segments";
import { HL7v2MySQLUtils } from "@healthcare-interoperability/hl7v2-utils-mysql";
import { TQ } from '@healthcare-interoperability/hl7v2-datatypes';

export class StoreSCH extends StoreBase {
    constructor(segmentInstance) {
      if (segmentInstance instanceof SCH) {
        super(segmentInstance, 'SCH');
      } else {
        throw new Error(`Not a valid Instance of SCH Segment !!`)
      }
    }
  
    prepareEntityIdentifier(entInt) {
      try {
        return entInt?.EntityIdentifier?.toString() || null;
      } catch (e) {
        console.error('Error preparing entity identifier:', e);
        return null;
      }
    }
  
    prepareSegmentFields() {
      this.setCWEFields(['ScheduleId', 'EventReason', 'AppointmentReason', 'AppointmentType', 'FillerStatusCode']);
      this.setXCNFields(['PlacerContactPerson', 'FillerContactPerson']);
  
      let segmentData = {
        sch_occurance_number: this.segmentInstance.OccurrenceNumber?.toString() || null,
        sch_placer_appt_id: this.prepareEntityIdentifier(this.segmentInstance.PlacerAppointmentId),
        sch_filler_appt_id: this.prepareEntityIdentifier(this.segmentInstance.FillerAppointmentId),
        sch_parent_placer_appt_id: this.prepareEntityIdentifier(this.segmentInstance.ParentPlacerAppointmentId),
        sch_parent_filler_appt_id: this.prepareEntityIdentifier(this.segmentInstance.ParentFillerAppointmentId),
        sch_start_datetime: null,
        sch_end_datetime: null,
      };
  
      const tqInstance = this.segmentInstance.AppointmentTimingQuantity?.[0];
  
      if (tqInstance instanceof TQ) {
        this.processTimingQuantity(tqInstance, segmentData);
      } else {
        console.warn('Invalid AppointmentTimingQuantity:', this.segmentInstance.AppointmentTimingQuantity);
      }
  
      this.storeSegmentFields(segmentData);
    }
  
    processTimingQuantity(tqInstance, segmentData) {
      try {
        if (tqInstance.StartDateTime) {
          segmentData.sch_start_datetime = HL7v2MySQLUtils.validateDTM(tqInstance.StartDateTime);
        }
      } catch (e) {
        console.error('Error processing TQ StartDateTime:', e);
      }
  
      try {
        if (tqInstance.EndDateTime) {
          segmentData.sch_end_datetime = HL7v2MySQLUtils.validateDTM(tqInstance.EndDateTime);
        }
      } catch (e) {
        console.error('Error processing TQ EndDateTime:', e);
      }
    }
  }