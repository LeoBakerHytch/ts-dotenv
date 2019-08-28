import { Env, EnvSchema } from './types';

/**
 * Only allows exactly 'true' or 'false'
 */
const booleanRegExp = /true|false/;

/**
 * Only allows integers.
 */
const numberRegExp = /\d+/;

export function validate(schema: EnvSchema, env: Env): boolean {
    for (const [key, schemaValue] of Object.entries(schema)) {
        if (!(key in env)) return false;

        const value = env[key];
        if (schemaValue === Boolean && !booleanRegExp.test(value)) return false;
        if (schemaValue === Number && !numberRegExp.test(value)) return false;
        if (schemaValue instanceof RegExp && !schemaValue.test(value)) return false;
    }
    return true;
}
