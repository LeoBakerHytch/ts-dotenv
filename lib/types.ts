export type Env = {
    [key: string]: string | undefined;
};

export type EnvSchemaValue =
    | BooleanConstructor
    | NumberConstructor
    | StringConstructor
    | RegExp
    | Array<string>;

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
        : never;
};
