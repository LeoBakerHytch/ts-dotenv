import { EnvErrorReport, EnvErrorType, EnvError } from './EnvError';
import { Env, EnvKeyConfig, NormalizedSchema } from './types';

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

export function validate(schema: NormalizedSchema, env: Env): env is ValidatedEnv {
    const report = validateSchema(schema, env);
    if (report) throw new EnvError(report);
    return true;
}

function validateSchema(schema: NormalizedSchema, env: Env): EnvErrorReport | null {
    const report: EnvErrorReport = {};

    for (const [key, config] of Object.entries(schema)) {
        const value = env[key];

        if (!valueExists(value)) {
            if (!config.optional) {
                report[key] = {
                    type: EnvErrorType.MISSING,
                    config,
                };
            }
        } else if (!typeMatches(config, value)) {
            report[key] = {
                type: EnvErrorType.WRONG_TYPE,
                config,
                receivedValue: value,
            };
        }
    }

    return Object.values(report).some(value => value != null) ? report : null;
}

function valueExists(value: string | undefined): value is string {
    return !(value === undefined || value === '');
}

function typeMatches(config: EnvKeyConfig, value: string): boolean {
    if (config.type === Boolean) return booleanRegExp.test(value);
    if (config.type === Number) return numberRegExp.test(value);
    if (config.type instanceof Array) return config.type.includes(value);
    if (config.type instanceof RegExp) return config.type.test(value);
    return true;
}
