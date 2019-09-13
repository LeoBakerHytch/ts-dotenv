import { normalize } from '../lib/normalize';

describe('normalize', () => {
    it('should normalize boolean', () => {
        const schemaValue = Boolean;
        expect(normalize(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });

    it('should normalize number', () => {
        const schemaValue = Number;
        expect(normalize(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });

    it('should normalize string', () => {
        const schemaValue = String;
        expect(normalize(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });

    it('should normalize a regular expression', () => {
        const schemaValue = /abc/;
        expect(normalize(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });

    it('should normalize a string union', () => {
        const schemaValue = ['abc'];
        expect(normalize(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });

    it('should not change config for an optional field', () => {
        const schemaValue = {
            type: String,
            optional: true,
        } as const;
        expect(normalize(schemaValue)).toEqual({
            type: String,
            optional: true,
        });
    });

    it('should normalize config with a default value', () => {
        const schemaValue = {
            type: String,
            default: 'abc',
        };
        expect(normalize(schemaValue)).toEqual({
            type: String,
            optional: true,
            default: 'abc',
        });
    });
});
