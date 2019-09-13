import { coerce } from '../lib/coerce';
import { normalize } from '../lib/normalize';

describe('coerce', () => {
    describe('boolean', () => {
        const schema = normalize({
            KEY: Boolean,
        });

        it('should coerce true', () => {
            const env = {
                KEY: 'true',
            };
            expect(coerce(schema, env)).toEqual({ KEY: true });
        });

        it('should coerce false', () => {
            const env = {
                KEY: 'false',
            };
            expect(coerce(schema, env)).toEqual({ KEY: false });
        });

        it('should use a default value', () => {
            const schema = normalize({
                KEY: {
                    type: Boolean,
                    default: true,
                },
            });
            expect(coerce(schema, {})).toEqual({ KEY: true });
        });
    });

    describe('number', () => {
        const schema = normalize({
            KEY: Number,
        });

        it('should coerce a positive number', () => {
            const env = {
                KEY: '1234',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 1234 });
        });

        it('should coerce zero', () => {
            const env = {
                KEY: '0',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 0 });
        });

        it('should coerce a negative number', () => {
            const env = {
                KEY: '-1234',
            };
            expect(coerce(schema, env)).toEqual({ KEY: -1234 });
        });

        it('should use a default value', () => {
            const schema = normalize({
                KEY: {
                    type: Number,
                    default: 10,
                },
            });
            expect(coerce(schema, {})).toEqual({ KEY: 10 });
        });
    });

    describe('regular expression', () => {
        it('should remain a string', () => {
            const schema = normalize({
                KEY: /abc/,
            });
            const env = {
                KEY: 'abc',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });

        it('should use a default value', () => {
            const schema = normalize({
                KEY: { type: /abc/, default: 'abc' },
            });
            expect(coerce(schema, {})).toEqual({ KEY: 'abc' });
        });
    });

    describe('string', () => {
        it('should remain a string', () => {
            const schema = normalize({
                KEY: String,
            });
            const env = {
                KEY: 'abc',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });

        it('should use a default value', () => {
            const schema = normalize({
                KEY: {
                    type: String,
                    default: 'xyz',
                },
            });
            expect(coerce(schema, {})).toEqual({ KEY: 'xyz' });
        });
    });

    describe('string union', () => {
        it('should remain a string', () => {
            const schema = normalize({
                KEY: ['abc'],
            });
            const env = {
                KEY: 'abc',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });

        it('should use a default value', () => {
            const schema = normalize({
                KEY: {
                    type: ['abc', 'def'],
                    default: 'def',
                },
            });
            expect(coerce(schema, {})).toEqual({ KEY: 'def' });
        });
    });
});
