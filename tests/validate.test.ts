import { EnvError } from '../lib/EnvError';
import { validate } from '../lib/validate';

describe('validate', () => {
    describe('boolean', () => {
        const schema = {
            KEY: Boolean,
        };

        it('should allow true', () => {
            const env = { KEY: 'true' };
            expect(validate(schema, env)).toBe(true);
        });

        it('should allow false', () => {
            const env = { KEY: 'false' };
            expect(validate(schema, env)).toBe(true);
        });

        it('should reject a boolean with leading whitespace', () => {
            const env = { KEY: ' false' };
            expect(() => validate(schema, env)).toThrow(EnvError);
        });

        it('should reject a boolean with trailing whitespace', () => {
            const env = { KEY: 'false ' };
            expect(() => validate(schema, env)).toThrow(EnvError);
        });

        it('should reject any other string', () => {
            const env = { KEY: 'string' };
            expect(() => validate(schema, env)).toThrow(EnvError);
        });
    });

    describe('number', () => {
        const schema = {
            KEY: Number,
        };

        it('should allow positive integers', () => {
            const env = { KEY: '123' };
            expect(validate(schema, env)).toBe(true);
        });

        it('should allow negative integers', () => {
            const env = { KEY: '-123' };
            expect(validate(schema, env)).toBe(true);
        });

        it('should allow a large number', () => {
            const env = { KEY: '123456789012345' };
            expect(validate(schema, env)).toBe(true);
        });

        it('should reject a number larger than the max safe integer', () => {
            const env = { KEY: '9007199254740992' };
            expect(() => validate(schema, env)).toThrow(EnvError);
        });
    });

    describe('regular expression', () => {
        const schema = {
            KEY: /abc/,
        };

        it('should allow a value that matches a provided regex', () => {
            const env = { KEY: 'abc' };
            expect(validate(schema, env)).toBe(true);
        });

        it('should reject a value that does not match a provided regex', () => {
            const env = { KEY: 'xyz' };
            expect(() => validate(schema, env)).toThrow(EnvError);
        });
    });

    describe('string', () => {
        const schema = {
            KEY: String,
        };

        it('should allow strings', () => {
            const env = { KEY: 'abc 123' };
            expect(validate(schema, env)).toBe(true);
        });

        it('should reject empty strings', () => {
            const env = { KEY: '' };
            expect(() => validate(schema, env)).toThrow(EnvError);
        });
    });

    describe('missing & extra keys', () => {
        const schema = { KEY: Boolean };

        it('should reject an env missing a required key', () => {
            const env = {};
            expect(() => validate(schema, env)).toThrow(EnvError);
        });

        it('should reject an env with an undefined key', () => {
            const env = { KEY: undefined };
            expect(() => validate(schema, env)).toThrow(EnvError);
        });

        it('should allow an env with extra keys', () => {
            const env = { KEY: 'true', NODE_ENV: 'production' };
            expect(validate(schema, env)).toBe(true);
        });
    });

    describe('reporting', () => {
        it('should throw a custom error type', () => {
            const schema = {
                MISSING: Boolean,
            };

            try {
                validate(schema, {});
            } catch (error) {
                expect(error).toBeInstanceOf(EnvError);
                expect(error.name).toEqual('EnvError');
            }
        });

        it('should report missing variables', () => {
            const schema = {
                MISSING: Boolean,
            };

            expect(() => validate(schema, {})).toThrowErrorMatchingSnapshot();
        });

        it('should report badly typed variables', () => {
            const schema = {
                BOOLEAN: Boolean,
                NUMBER: Number,
                REGEXP: /abc/,
            };

            const env = {
                BOOLEAN: '123',
                NUMBER: 'abc',
                REGEXP: 'true',
            };

            expect(() => validate(schema, env)).toThrowErrorMatchingSnapshot();
        });
    });
});
