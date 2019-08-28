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
});
