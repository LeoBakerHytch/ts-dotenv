import { normalize } from './normalize';
import { EnvSchema, EnvType } from './types';
import { ValidatedEnv } from './validate';

type CoercedEnv = {
    [key: string]: boolean | Buffer | number | string;
};

export function coerce<S extends EnvSchema>(
    schema: S,
    env: ValidatedEnv,
): EnvType<S> {
    const coerced: CoercedEnv = {};

    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];
        const config = normalize(schemaValue);

        if (config.default !== undefined && (value === '' || value === undefined)) {
            coerced[key] = config.default;
            continue;
        }

        if (config.type === Boolean) {
            coerced[key] = value === 'true';
            continue;
        }

        if (config.type === Buffer) {
            coerced[key] = Buffer.from(value, 'base64');
            continue;
        }

        if (config.type === Number) {
            coerced[key] = parseInt(value, 10);
            continue;
        }

        coerced[key] = value;
    }

    return coerced as EnvType<S>;
}
