import { EnvKeyConfig, EnvSchema, EnvSchemaValue, NormalizedSchema } from './types';

export function normalize(schema: EnvSchema): NormalizedSchema {
    const result: NormalizedSchema = {};
    for (const [key, schemaValue] of Object.entries(schema)) result[key] = getConfig(schemaValue);
    return result;
}

function getConfig(schemaValue: EnvSchemaValue): EnvKeyConfig {
    return 'type' in schemaValue
        ? {
              type: schemaValue.type,
              optional: 'optional' in schemaValue ? schemaValue.optional : true,
              default: 'default' in schemaValue ? schemaValue.default : undefined,
          }
        : {
              type: schemaValue,
              optional: false,
          };
}
