import { EnvSchema, EnvType } from './types';
import { ValidatedEnv } from './validate';

type CoercedEnv = {
    [key: string]: boolean | number | string;
};

export function coerce<S extends EnvSchema>(schema: S, env: ValidatedEnv): EnvType<S> {
    const coerced: CoercedEnv = {};

    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];

        if (schemaValue === Boolean) {
            coerced[key] = value === 'true';
        } else if (schemaValue === Number) {
            coerced[key] = parseInt(value, 10);
        } else {
            coerced[key] = value;
        }
    }

    return coerced as EnvType<S>;
}
