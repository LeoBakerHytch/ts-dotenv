import { coerce } from '../lib/coerce';

describe('coerce', () => {
    describe('boolean', () => {
        const schema = {
            KEY: Boolean,
        };

        it('should coerce true', () => {
            const env = { KEY: 'true' };
            expect(coerce(schema, env)).toEqual({ KEY: true });
        });

        it('should coerce false', () => {
            const env = { KEY: 'false' };
            expect(coerce(schema, env)).toEqual({ KEY: false });
        });
    });

    describe('number', () => {
        const schema = {
            KEY: Number,
        };

        it('should coerce a positive number', () => {
            const env = { KEY: '1234' };
            expect(coerce(schema, env)).toEqual({ KEY: 1234 });
        });

        it('should coerce zero', () => {
            const env = { KEY: '0' };
            expect(coerce(schema, env)).toEqual({ KEY: 0 });
        });

        it('should coerce a negative number', () => {
            const env = { KEY: '-1234' };
            expect(coerce(schema, env)).toEqual({ KEY: -1234 });
        });
    });

    describe('regular expression', () => {
        const schema = {
            KEY: /abc/,
        };

        it('should remain a string', () => {
            const env = { KEY: 'abc' };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });
    });

    describe('string', () => {
        const schema = {
            KEY: String,
        };

        it('should remain a string', () => {
            const env = { KEY: 'abc' };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });
    });
});
