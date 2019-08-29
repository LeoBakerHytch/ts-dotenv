import { EnvSchemaValue } from './types';

export enum EnvErrorType {
    MISSING,
    WRONG_TYPE,
}

export type EnvErrorReport = {
    [key: string]: {
        type: EnvErrorType;
        schemaValue: EnvSchemaValue;
        value?: string;
    };
};

export class EnvError extends Error {
    name = 'EnvError';
    code = 'BAD_ENVIRONMENT_VARIABLES';

    constructor(public readonly report?: EnvErrorReport) {
        super('Invalid or missing environment variables');
    }

    toString() {
        if (!this.report) return this.message;

        const errors = Object.entries(this.report).map(([key, { type, schemaValue, value }]) =>
            formatError(key, type, schemaValue, value),
        );

        return super.toString() + `\n    - ${errors.join('\n    - ')}\n`;
    }
}

function formatError(
    key: string,
    type: EnvErrorType,
    schemaValue: EnvSchemaValue,
    value: string | undefined,
): string {
    switch (type) {
        case EnvErrorType.MISSING:
            return `Expected value for key '${key}'; none found`;

        case EnvErrorType.WRONG_TYPE:
            return schemaValue instanceof RegExp
                ? `Expected value for key '${key}' to match ${schemaValue}; got '${value}'`
                : `Expected value for key '${key}' of type ${schemaValue.name}; got '${value}'`;
    }
}
