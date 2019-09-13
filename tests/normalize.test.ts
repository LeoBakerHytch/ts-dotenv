import { normalize } from '../lib/normalize';

describe('normalize', () => {
    it('should normalize a boolean field', () => {
        const schema = {
            KEY: Boolean,
        };
        expect(normalize(schema)).toEqual({
            KEY: {
                type: Boolean,
                optional: false,
            },
        });
    });

    it('should normalize a number field', () => {
        const schema = {
            KEY: Number,
        };
        expect(normalize(schema)).toEqual({
            KEY: {
                type: Number,
                optional: false,
            },
        });
    });

    it('should normalize a string field', () => {
        const schema = {
            KEY: String,
        };
        expect(normalize(schema)).toEqual({
            KEY: {
                type: String,
                optional: false,
            },
        });
    });

    it('should normalize a regular expression field', () => {
        const schema = {
            KEY: /abc/,
        };
        expect(normalize(schema)).toEqual({
            KEY: {
                type: schema.KEY,
                optional: false,
            },
        });
    });

    it('should normalize a string union field', () => {
        const schema = {
            KEY: ['abc'],
        };
        expect(normalize(schema)).toEqual({
            KEY: {
                type: schema.KEY,
                optional: false,
            },
        });
    });

    it('should not change an optional field', () => {
        const schema = {
            KEY: {
                type: String,
                optional: true,
            },
        } as const;
        expect(normalize(schema)).toEqual({
            KEY: {
                type: String,
                optional: true,
            },
        });
    });

    it('should normalize a field with a default value', () => {
        const schema = {
            KEY: {
                type: String,
                default: 'abc',
            },
        };
        expect(normalize(schema)).toEqual({
            KEY: {
                type: String,
                optional: true,
                default: 'abc',
            },
        });
    });
});
