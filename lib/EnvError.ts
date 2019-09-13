import { EnvKeyConfig } from './types';

export enum EnvErrorType {
    MISSING = 'MISSING',
    WRONG_TYPE = 'WRONG_TYPE',
}

export type EnvErrorReport = {
    [key: string]: {
        type: EnvErrorType;
        config: EnvKeyConfig;
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
        const [key, { type, config, receivedValue }] = entry;
        return formatError(key, type, config, receivedValue);
    });
    return `Invalid or missing environment variables\n    - ${errors.join('\n    - ')}\n`;
}

function formatError(
    key: string,
    type: EnvErrorType,
    config: EnvKeyConfig,
    value: string | undefined,
): string {
    switch (type) {
        case EnvErrorType.MISSING:
            return `Expected value for key '${key}'; none found`;

        case EnvErrorType.WRONG_TYPE:
            if (config.type instanceof RegExp) {
                return `Expected value for key '${key}' to match ${config.type}; got '${value}'`;
            }

            if (config.type instanceof Array) {
                const expectedValues = config.type.map(value => `'${value}'`).join(' | ');
                return `Expected value for key '${key}' to be one of ${expectedValues}; got '${value}'`;
            }

            return `Expected value for key '${key}' of type ${config.type.name}; got '${value}'`;
    }
}
