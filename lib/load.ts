import { readFileSync } from 'fs';
import { parse } from './parse';
import { validate } from './validate';
import { EnvSchema, EnvType } from './types';
import { coerce } from './coerce';

interface Options {
    fileName?: string;
    encoding?: string;
    overrideProcessEnv?: boolean;
}

export function load<S extends EnvSchema>(schema: S, fileName?: string): EnvType<S>;
export function load<S extends EnvSchema>(schema: S, options?: Options): EnvType<S>;
export function load<S extends EnvSchema>(
    schema: S,
    fileNameOrOptions?: string | Options,
): EnvType<S> {
    const { fileName = '.env', encoding = 'utf-8', overrideProcessEnv = false } =
        typeof fileNameOrOptions === 'string'
            ? { fileName: fileNameOrOptions }
            : fileNameOrOptions || {};

    const raw = loadDotEnv(fileName, encoding);
    const parsed = parse(raw);

    const merged = overrideProcessEnv
        ? { ...process.env, ...parsed }
        : { ...parsed, ...process.env };

    const valid = validate(schema, merged);
    if (valid) return coerce(schema, merged);

    throw Error('Invalid or missing environment variables');
}

function loadDotEnv(fileName: string, encoding: string): string {
    try {
        return readFileSync(fileName, encoding);
    } catch {
        return '';
    }
}
