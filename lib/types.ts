export type Env = {
    [key: string]: string | undefined;
};

export type EnvSchemaType =
    | BooleanConstructor
    | NumberConstructor
    | StringConstructor
    | RegExp
    | Array<string>;

interface OptionalKeyConfig {
    type: EnvSchemaType;
    optional: true;
}

interface BooleanKeyConfig {
    type: BooleanConstructor;
    default: boolean;
}

interface NumberKeyConfig {
    type: NumberConstructor;
    default: number;
}

interface StringKeyConfig {
    type: StringConstructor | RegExp | Array<string>;
    default: string;
}

export type EnvSchemaValue =
    | EnvSchemaType
    | OptionalKeyConfig
    | BooleanKeyConfig
    | NumberKeyConfig
    | StringKeyConfig;

export interface EnvKeyConfig {
    type: EnvSchemaType;
    optional: boolean;
    default?: boolean | number | string;
}

export type EnvSchema = {
    [key: string]: EnvSchemaValue;
};

/**
 * Resolves to the type of the provided environment schema.
 *
 * @typeParam S - pass `typeof schema` here
 */
export type EnvType<S extends EnvSchema> = {
    [K in keyof S]: S[K] extends BooleanConstructor
        ? boolean
        : S[K] extends NumberConstructor
        ? number
        : S[K] extends StringConstructor
        ? string
        : S[K] extends RegExp
        ? string
        : S[K] extends Array<infer U>
        ? U
        : never;
};
