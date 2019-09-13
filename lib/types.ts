export type Env = {
    [key: string]: string | undefined;
};

export type EnvSchema = {
    [key: string]: EnvSchemaValue;
};

export interface EnvKeyConfig {
    type: EnvSchemaType;
    optional: boolean;
    default?: boolean | number | string;
}

export type EnvSchemaValue = DefaultValueKeyConfig | OptionalKeyConfig | EnvSchemaType;

export type EnvSchemaType =
    | BooleanConstructor
    | NumberConstructor
    | StringConstructor
    | RegExp
    | Array<string>;

interface OptionalKeyConfig<T extends EnvSchemaType = EnvSchemaType> {
    type: T;
    optional: boolean;
}

type DefaultValueKeyConfig =
    | DefaultBooleanKeyConfig
    | DefaultNumberKeyConfig
    | DefaultStringKeyConfig;

interface DefaultBooleanKeyConfig {
    type: BooleanConstructor;
    default: boolean;
}

interface DefaultNumberKeyConfig {
    type: NumberConstructor;
    default: number;
}

interface DefaultStringKeyConfig {
    type: StringConstructor | RegExp | Array<string>;
    default: string;
}

/**
 * Resolves to the type of the provided environment schema.
 *
 * @typeParam S - pass `typeof schema` here
 */
export type EnvType<S extends EnvSchema> = {
    [K in keyof S]: S[K] extends DefaultValueKeyConfig
        ? EnvSchemaDefaultValueType<S[K]>
        : S[K] extends OptionalKeyConfig<infer U>
        ? (EnvSchemaValueType<S[K]['type']> | undefined)
        : S[K] extends EnvSchemaType
        ? EnvSchemaValueType<S[K]>
        : never;
};

type EnvSchemaDefaultValueType<C extends DefaultValueKeyConfig> = C extends DefaultBooleanKeyConfig
    ? boolean
    : C extends DefaultNumberKeyConfig
    ? number
    : C extends DefaultStringKeyConfig
    ? string
    : never;

type EnvSchemaValueType<T extends EnvSchemaType> = T extends BooleanConstructor
    ? boolean
    : T extends NumberConstructor
    ? number
    : T extends StringConstructor
    ? string
    : T extends RegExp
    ? string
    : T extends Array<infer U>
    ? U
    : never;
