import { readFileSync } from 'fs';
import { parse } from './parse';
import { validate } from './validate';
import { EnvSchema, EnvType } from './types';
import { coerce } from './coerce';

interface Options {
    path?: string;
    encoding?: string;
    overrideProcessEnv?: boolean;
}

export function load<S extends EnvSchema>(schema: S, path?: string): EnvType<S>;
export function load<S extends EnvSchema>(schema: S, options?: Options): EnvType<S>;
export function load<S extends EnvSchema>(
    schema: S,
    pathOrOptions?: string | Options,
): EnvType<S> {
    const { path = '.env', encoding = 'utf-8', overrideProcessEnv = false } =
        typeof pathOrOptions === 'string'
            ? { path: pathOrOptions }
            : pathOrOptions || {};

    const raw = loadDotEnv(path, encoding);
    const parsed = parse(raw);

    const merged = overrideProcessEnv
        ? { ...process.env, ...parsed }
        : { ...parsed, ...process.env };

    if (validate(schema, merged)) {
        return coerce(schema, merged);
    }

    throw Error('Invalid or missing environment variables');
}

function loadDotEnv(fileName: string, encoding: string): string {
    try {
        return readFileSync(fileName, encoding);
    } catch {
        return '';
    }
}
