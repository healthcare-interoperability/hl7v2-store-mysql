import { PrepareCWEField, PrepareCXField, PrepareXADField, PrepareXCNField, PrepareXTNField } from "@healthcare-interoperability/hl7v2-prepare-mysql";
import { TypeCastCWE, TypeCastCX, TypeCastXAD, TypeCastXCN, TypeCastXTN } from "@healthcare-interoperability/hl7v2-typecast";

/**
 * Represents a base class for storing HL7v2 message segments and fields.
 */
export class StoreBase {
    static TypeCast = {
        CWE: TypeCastCWE,
        CX: TypeCastCX,
        XCN: TypeCastXCN,
        XAD: TypeCastXAD,
        XTN: TypeCastXTN
    };
    
    /**
     * Constructor for StoreBase class.
     * @param {object} segmentInstance - Instance of the HL7v2 segment.
     * @param {string} segment - Name of the HL7v2 segment.
     */
    constructor(segmentInstance, segment) {
        this.segmentInstance = segmentInstance;
        this.segment = segment;
        this.setGroupId(1);
        this._setSID(1);
        this.records = {};
        this.CWEFields = [];
        this.CXFields = [];
        this.XCNFields = [];
        this.XADFields = [];
        this.XTNFields = [];
    }

    /**
     * Set records for the store.
     * @param {object} records - Records to set.
     * @param {boolean} [force=false] - Force setting the records even if not empty.
     * @throws {Error} If records already exist and force flag is not set.
     */
    setRecords(records, force = false) {
        if (Object.keys(records).length === 0 || force) {
            this.records = records;
        } else {
            throw new Error(`Instance Record not empty. Either set record before processing or use force flag!`);
        }
    }

    /**
     * Set SID (System Identifier).
     * @param {string} sid - The SID to set.
     * @private
     */
    _setSID(sid) {
        this.msgSID = sid;
    }

    /**
     * Set the group ID.
     * @param {string} groupId - The group ID to set.
     */
    setGroupId(groupId) {
        this.groupId = groupId;
        return this;
    }

    /**
     * Sets the message ID.
     * @param {string} messageId - The message ID to set.
     */
    setMessageId(messageId) {
        this.messageId = messageId;
        return this;
    }

    /**
     * Create and prepare a field.
     * @param {string} fieldName - Name of the field.
     * @param {*} fieldValue - Value of the field.
     * @param {*} typeCaster - Type caster for the field.
     * @param {*} fieldPrepare - Field preparer.
     * @returns {object|null} The prepared field object or null if data is invalid.
     */
    _createAndPrepareField(fieldName, fieldValue, typeCaster, fieldPrepare) {
        if (fieldValue) {
            const castedValue = new typeCaster(fieldValue).typecast();
            return new fieldPrepare(fieldName, castedValue)
                .setGroupId(this.groupId)
                .setSID(this.msgSID)
                .setMessageId(this.messageId)
                .setSegment(this.segment)
                .prepare();
        }
        return null;
    }

    /**
     * Store fields.
     * @param {string[]} fields - Array of field names.
     * @param {*} fieldPrepare - Field preparer.
     * @param {string} fieldName - Name of the field.
     */
    _storeFields(fields, fieldPrepare, fieldName) {
        if (!this.records[fieldName]) {
            this.records[fieldName] = [];
        }
        fields.forEach(field => {
            if (Array.isArray(this.segmentInstance[field])) {
                this.segmentInstance[field].forEach(fieldData => {
                    const record = this._createAndPrepareField(
                        field,
                        fieldData,
                        StoreBase.TypeCast[fieldName],
                        fieldPrepare
                    );
                    if (record) {
                        this.records[fieldName].push(record);
                    }

                });
            } else {
                const record = this._createAndPrepareField(
                    field,
                    this.segmentInstance[field],
                    StoreBase.TypeCast[fieldName],
                    fieldPrepare
                );
                if (record) {
                    this.records[fieldName].push(record);
                }

            }
        });
    }

    /**
     * Store CWE fields.
     * @param {string[]} CWEFields - Array of CWE field names.
     */
    storeCWEFields(CWEFields) {
        this._storeFields(CWEFields, PrepareCWEField, 'CWE');
    }

    /**
     * Store CX fields.
     * @param {string[]} CXFields - Array of CX field names.
     */
    storeCXFields(CXFields) {
        this._storeFields(CXFields, PrepareCXField, 'CX');
    }

    /**
     * Store XCN fields.
     * @param {string[]} XCNFields - Array of XCN field names.
     */
    storeXCNFields(XCNFields) {
        this._storeFields(XCNFields, PrepareXCNField, 'XCN');
    }

    /**
     * Store XAD fields.
     * @param {string[]} XADFields - Array of XAD field names.
     */
    storeXADFields(XADFields) {
        this._storeFields(XADFields, PrepareXADField, 'XAD');
    }

    /**
     * Store XTN fields.
     * @param {string[]} XTNFields - Array of XTN field names.
     */
    storeXTNFields(XTNFields) {
        this._storeFields(XTNFields, PrepareXTNField, 'XTN');
    }

    /**
     * Store segment fields.
     * @param {object} data - Data to store.
     */
    storeSegmentFields(data) {
        if (!this.records[this.segment]) {
            this.records[this.segment] = [];
        }
        this.records[this.segment].push({
            msg_id: this.messageId,
            msg_sid: this.msgSID,
            msg_group_id: this.groupId,
            ...data
        });
    }

    setCWEFields(fields){
        if(Array.isArray(fields)){
            this.CWEFields.push(...fields);
        } else {
            this.CWEFields.push(fields);
        }
    }

    setXCNFields(fields){
        if(Array.isArray(fields)){
            this.XCNFields.push(...fields);
        } else {
            this.XCNFields.push(fields);
        }
    }

    setCXFields(fields){
        if(Array.isArray(fields)){
            this.CXFields.push(...fields);
        } else {
            this.CXFields.push(fields);
        }
    }

    setXTNFields(fields){
        if(Array.isArray(fields)){
            this.XTNFields.push(...fields);
        } else {
            this.XTNFields.push(fields);
        }
    }

    setXADFields(fields){
        if(Array.isArray(fields)){
            this.XADFields.push(...fields);
        } else {
            this.XADFields.push(fields);
        }
    }

    prepareSegmentFields(){}

    /**
     * Prepare the records with validation before storing the records.
     * @throws {Error} If message ID or SID is missing.
     */
    prepare(){
        if (!this.messageId) {
            throw new Error(`Message ID is required for saving the record. Please set the message ID before preparing.`);
        }
        if (!this.msgSID) {
            throw new Error(`Message SID is required for saving the record. Please ensure Message SID present before preparing.`);
        }

        try {
            this.prepareSegmentFields();

            if(this.CWEFields?.length > 0){
                this.storeCWEFields(this.CWEFields);
            }

            if(this.CXFields?.length > 0){
                this.storeCXFields(this.CXFields);
            }

            if(this.XCNFields?.length > 0){
                this.storeXCNFields(this.XCNFields);
            }

            if(this.XADFields?.length > 0){
                this.storeXADFields(this.XADFields);
            }

            if(this.XTNFields?.length > 0){
                this.storeXTNFields(this.XTNFields);
            }
        } catch (e) {
            console.error(e); // Consider handling the error more gracefully
        }
        return this.records;
    }

    store() {}
}
