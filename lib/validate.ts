import { Env, EnvSchema } from './types';

/**
 * Only allows exactly 'true' or 'false'
 */
const booleanRegExp = /^(true|false)$/;

/**
 * Only allows integers; crudely prevents values greater than MAX_SAFE_INTEGER.
 */
const numberRegExp = /^-?\d{1,15}$/;

export function validate(schema: EnvSchema, env: Env): boolean {
    for (const [key, schemaValue] of Object.entries(schema)) {
        if (!(key in env)) return false;

        const value = env[key];
        if (value === undefined) return false;

        if (schemaValue === Boolean && !booleanRegExp.test(value)) return false;
        if (schemaValue === Number && !numberRegExp.test(value)) return false;
        if (schemaValue instanceof RegExp && !schemaValue.test(value)) return false;
        if (value === '') return false;
    }
    return true;
}
