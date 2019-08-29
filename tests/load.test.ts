import { load } from '../lib/load';

describe('load', () => {
    afterEach(() => {
        process.env = {};
    });

    it('should load .env from the working directory', () => {
        const env = load({
            BOOLEAN: Boolean,
            NUMBER: Number,
            REGEXP: /^abc$/,
            STRING: String,
        });
        expect(env).toEqual({
            BOOLEAN: true,
            NUMBER: 1234,
            REGEXP: 'abc',
            STRING: 'Lorem ipsum',
        });
    });

    describe('custom location', () => {
        it('should load .env from a custom location', () => {
            const schema = { CUSTOM: Number };
            const env = load(schema, '.env.custom');
            expect(env).toEqual({ CUSTOM: 123 });
        });

        it('should load .env from a custom location (via options)', () => {
            const schema = { CUSTOM: Number };
            const env = load(schema, { path: '.env.custom' });
            expect(env).toEqual({ CUSTOM: 123 });
        });

        it('should not error even when .env is missing', () => {
            const schema = { ONLY_IN_PROCESS_ENV: Number };
            process.env.ONLY_IN_PROCESS_ENV = '123';
            const env = load(schema);
            expect(env).toEqual({ ONLY_IN_PROCESS_ENV: 123 });
        });
    });

    describe('process.env', () => {
        it('should merge loaded .env with process.env', () => {
            process.env.B = '123';
            const schema = { A: Boolean, B: Number };
            const env = load(schema, '.env.partial');
            expect(env).toEqual({ A: true, B: 123 });
        });

        it('should override .env values from process.env (by default)', () => {
            process.env.A = 'false';
            const schema = { A: Boolean };
            const env = load(schema, '.env.partial');
            expect(env).toEqual({ A: false });
        });

        it('should allow .env to override process.env (by option)', () => {
            process.env.A = 'false';
            const schema = { A: Boolean };
            const env = load(schema, { path: '.env.partial', overrideProcessEnv: true });
            expect(env).toEqual({ A: true });
        });
    });

    describe('errors', () => {
        it('should throw loading .env with missing keys', () => {
            expect(() => {
                load({ MISSING: Number });
            }).toThrow();
        });

        it('should throw loading .env that does not match the schema', () => {
            expect(() => {
                load({ BOOLEAN: Number });
            }).toThrow();
        });
    });
});
