import { validate } from '../lib/validate';

describe('validate', () => {
    describe('boolean', () => {
        const schema = {
            KEY: Boolean,
        };

        it('should allow true', () => {
            const env = { KEY: 'true' };
            expect(validate(schema, env)).toEqual(true);
        });

        it('should allow false', () => {
            const env = { KEY: 'false' };
            expect(validate(schema, env)).toEqual(true);
        });

        it('should reject a boolean with leading whitespace', () => {
            const env = { KEY: ' false' };
            expect(validate(schema, env)).toEqual(false);
        });

        it('should reject a boolean with trailing whitespace', () => {
            const env = { KEY: 'false ' };
            expect(validate(schema, env)).toEqual(false);
        });

        it('should reject any other string', () => {
            const env = { KEY: 'string' };
            expect(validate(schema, env)).toEqual(false);
        });
    });

    describe('number', () => {
        const schema = {
            KEY: Number,
        };

        it('should allow positive integers', () => {
            const env = { KEY: '123' };
            expect(validate(schema, env)).toEqual(true);
        });

        it('should allow negative integers', () => {
            const env = { KEY: '-123' };
            expect(validate(schema, env)).toEqual(true);
        });

        it('should allow a large number', () => {
            const env = { KEY: '123456789012345' };
            expect(validate(schema, env)).toEqual(true);
        });

        it('should reject a number larger than the max safe integer', () => {
            const env = { KEY: '9007199254740992' };
            expect(validate(schema, env)).toEqual(false);
        });
    });
});
