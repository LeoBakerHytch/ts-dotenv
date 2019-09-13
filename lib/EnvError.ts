import { EnvSchemaType } from './types';

export enum EnvErrorType {
    MISSING = 'MISSING',
    WRONG_TYPE = 'WRONG_TYPE',
}

export type EnvErrorReport = {
    [key: string]: {
        type: EnvErrorType;
        schemaValue: EnvSchemaType;
        receivedValue?: string;
    };
};

export class EnvError extends Error {
    readonly name: string;
    readonly report: EnvErrorReport;

    constructor(report: EnvErrorReport) {
        super(formatReport(report));
        this.name = 'EnvError';
        this.report = report;
    }
}

function formatReport(report: EnvErrorReport) {
    const errors = Object.entries(report).map(entry => {
        const [key, { type, schemaValue, receivedValue }] = entry;
        return formatError(key, type, schemaValue, receivedValue);
    });
    return `Invalid or missing environment variables\n    - ${errors.join('\n    - ')}\n`;
}

function formatError(
    key: string,
    type: EnvErrorType,
    schemaValue: EnvSchemaType,
    value: string | undefined,
): string {
    switch (type) {
        case EnvErrorType.MISSING:
            return `Expected value for key '${key}'; none found`;

        case EnvErrorType.WRONG_TYPE:
            if (schemaValue instanceof RegExp) {
                return `Expected value for key '${key}' to match ${schemaValue}; got '${value}'`;
            }

            if (schemaValue instanceof Array) {
                const expectedValues = schemaValue.map(value => `'${value}'`).join(', ');
                return `Expected value for key '${key}' to be one of ${expectedValues}; got ${value}`;
            }

            return `Expected value for key '${key}' of type ${schemaValue.name}; got '${value}'`;
    }
}
