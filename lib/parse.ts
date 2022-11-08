import { Env } from './types';

/**
 * @see http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap08.html
 */
const lineRegExp = /^([a-zA-Z_]+[a-zA-Z0-9_]*)=(.*)$/;

/**
 * Accounts for CR / LF / CR+LF line breaks
 */
const lineBreaksRegExp = /\r\n|\r|\n/;

export function parse(dotEnv: string): Env {
    const lines = dotEnv.split(lineBreaksRegExp);
    const parsed: Env = {};

    for (const line of lines) {
        const match = line.match(lineRegExp);
        if (!match) continue;

        const variableName = match[1];

        // Adapted from https://github.com/motdotla/dotenv/blob/463952012640a919a82be0de11f473c1224b498a/lib/main.js
        let value = match[2].trim() || '';
        const maybeQuote = value[0];

        // Remove surrounding quotes
        value = value.replace(/^(['"])([\s\S]*)\1$/gm, '$2');

        // Expand newlines if double quoted
        if (maybeQuote === '"') {
            value = value.replace(/\\n/g, '\n');
            value = value.replace(/\\r/g, '\r');
        }

        parsed[variableName] = value;
    }

    return parsed;
}
