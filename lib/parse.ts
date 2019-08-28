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
        parsed[variableName] = match[2];
    }

    return parsed;
}
