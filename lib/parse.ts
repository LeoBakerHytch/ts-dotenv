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

        // borrowed from https://github.com/motdotla/dotenv/blob/7301ac9be0b2c766f865bbe24280bf82586d25aa/lib/main.js#L49
        let val = match[2] || '';
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
            val = val.substring(1, end);
        } else {
            // remove surrounding whitespace
            val = val.trim();
        }

        parsed[variableName] = val;
    }

    return parsed;
}
