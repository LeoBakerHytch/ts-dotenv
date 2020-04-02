import { coerce } from '../lib/coerce';

describe('coerce', () => {
    describe('boolean', () => {
        const schema = {
            KEY: Boolean,
        };

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
            const schema = {
                KEY: {
                    type: Boolean,
                    default: true,
                },
            };
            expect(coerce(schema, {})).toEqual({ KEY: true });
        });
    });

    describe('buffer', () => {
        it('should coerce base64-encoded data', () => {
            const schema = {
                KEY: Buffer,
            };

            const env = {
                KEY: '8J+Sjg==',
            };

            expect(coerce(schema, env).KEY.toString()).toEqual('💎');
        });

        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: Buffer,
                    default: Buffer.from('🎉'),
                },
            };

            expect(coerce(schema, {}).KEY.toString()).toEqual('🎉');
        });
    });

    describe('number', () => {
        const schema = {
            KEY: Number,
        };

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
            const schema = {
                KEY: {
                    type: Number,
                    default: 10,
                },
            };
            expect(coerce(schema, {})).toEqual({ KEY: 10 });
        });
    });

    describe('regular expression', () => {
        it('should remain a string', () => {
            const schema = {
                KEY: /abc/,
            };
            const env = {
                KEY: 'abc',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });

        it('should use a default value', () => {
            const schema = {
                KEY: { type: /abc/, default: 'abc' },
            };
            expect(coerce(schema, {})).toEqual({ KEY: 'abc' });
        });
    });

    describe('string', () => {
        it('should remain a string', () => {
            const schema = {
                KEY: String,
            };
            const env = {
                KEY: 'abc',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });

        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: String,
                    default: 'xyz',
                },
            };
            expect(coerce(schema, {})).toEqual({ KEY: 'xyz' });
        });
    });

    describe('string union', () => {
        it('should remain a string', () => {
            const schema = {
                KEY: ['abc'],
            };
            const env = {
                KEY: 'abc',
            };
            expect(coerce(schema, env)).toEqual({ KEY: 'abc' });
        });

        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: ['abc', 'def'],
                    default: 'def',
                },
            };
            expect(coerce(schema, {})).toEqual({ KEY: 'def' });
        });
    });
});
