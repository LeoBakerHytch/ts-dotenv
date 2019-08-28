import { Env, EnvSchema, EnvType } from './types';

type CoercedEnv = {
    [key: string]: boolean | number | string;
};

export function coerce<S extends EnvSchema>(schema: S, env: Env): EnvType<S> {
    const coerced: CoercedEnv = {};

    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key] || '';

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
