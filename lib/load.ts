import { readFileSync } from 'fs';

import { coerce } from './coerce';
import { EnvError } from './EnvError';
import { parse } from './parse';
import { EnvSchema, EnvType } from './types';
import { validate } from './validate';

interface Options {
    path?: string;
    encoding?: string;
    overrideProcessEnv?: boolean;
}

/**
 * Loads .env from the working directory, merges it with process.env (which takes precedence),
 * validates against the provided schema, and coerces to the corresponding types.
 *
 * @param schema - Mapping from variable names to desired types
 * @param path - Custom path, also resolved relative to working directory
 *
 * @throws EnvError
 */
export function load<S extends EnvSchema>(schema: S, path?: string): EnvType<S>;

/**
 *
 * Loads .env from the working directory, merges it with process.env, validates against the
 * provided schema, and coerces to the corresponding types. May specify via options: a different
 * .env path; file encoding; whether .env overrides values from process.env.
 *
 * @param schema - Mapping from variable names to desired types
 * @param options - Options object
 *
 * @throws EnvError
 */
export function load<S extends EnvSchema>(schema: S, options?: Options): EnvType<S>;

export function load<S extends EnvSchema>(schema: S, pathOrOptions?: string | Options): EnvType<S> {
    const { path = '.env', encoding = 'utf-8', overrideProcessEnv = false } =
        typeof pathOrOptions === 'string' ? { path: pathOrOptions } : pathOrOptions || {};

    const raw = loadDotEnv(path, encoding);
    const parsed = parse(raw);

    const merged = overrideProcessEnv
        ? { ...process.env, ...parsed }
        : { ...parsed, ...process.env };

    validate(schema, merged);

    return coerce(schema, merged);
}

function loadDotEnv(fileName: string, encoding: string): string {
    try {
        return readFileSync(fileName, encoding);
    } catch {
        return '';
    }
}
