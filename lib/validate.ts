import { EnvErrorReport, EnvErrorType, EnvError } from './EnvError';
import { Env, EnvSchema } from './types';

/**
 * Only allows exactly 'true' or 'false'
 */
const booleanRegExp = /^(true|false)$/;

/**
 * Only allows integers; crudely prevents values greater than MAX_SAFE_INTEGER.
 */
const numberRegExp = /^-?\d{1,15}$/;

export type ValidatedEnv = {
    [key: string]: string;
};

export function validate(schema: EnvSchema, env: Env): env is ValidatedEnv {
    const report = validateSchema(schema, env);
    if (report) throw new EnvError(report);
    return true;
}

function validateSchema(schema: EnvSchema, env: Env): EnvErrorReport | null {
    const report: EnvErrorReport = {};

    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];

        if (!valueExists(value)) {
            report[key] = {
                type: EnvErrorType.MISSING,
                schemaValue,
            };
        } else if (!typeMatches(schemaValue, value)) {
            report[key] = {
                type: EnvErrorType.WRONG_TYPE,
                schemaValue,
                value,
            };
        }
    }

    return Object.values(report).some(value => value != null) ? report : null;
}

function valueExists(value: string | undefined): value is string {
    return !(value === undefined || value === '');
}

function typeMatches(schemaValue: any, value: string): boolean {
    switch (schemaValue) {
        case Boolean:
            return booleanRegExp.test(value);

        case Number:
            return numberRegExp.test(value);

        default:
            if (schemaValue instanceof RegExp) return schemaValue.test(value);
            return true;
    }
}
