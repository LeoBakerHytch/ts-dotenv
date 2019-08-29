import { parse } from '../lib/parse';

describe('parse', () => {
    it('should parse key-value environment variable pairs', () => {
        expect(parse(ok1)).toEqual({
            BOOLEAN: 'true',
            NUMBER: '3000',
            STRING: 'local',
        });
    });

    it('should parse string values with whitespace', () => {
        expect(parse(ok2)).toEqual({
            STRING_WITH_WHITESPACE: 'Lorem ipsum',
        });
    });

    it('should parse large number values', () => {
        expect(parse(ok3)).toEqual({
            LARGE_NUMBER: '123456789012345',
        });
    });

    it('should parse lowercase identifiers', () => {
        expect(parse(ok4)).toEqual({
            lowercase_identifier: 'true',
        });
    });

    it('should reject a line with no key-value pair', () => {
        expect(parse(bad1)).toEqual({});
    });

    it('should reject an identifier with a period', () => {
        expect(parse(bad2)).toEqual({});
    });

    it('should ignore comments', () => {
        expect(parse(comment)).toEqual({});
    });
});

const ok1 = `
STRING=local
NUMBER=3000
BOOLEAN=true
`;

const ok2 = `
STRING_WITH_WHITESPACE=Lorem ipsum
`;

const ok3 = `
LARGE_NUMBER=123456789012345
`;

const ok4 = `
lowercase_identifier=true
`;

const bad1 = `
LINE_WITH_NO_EQUALS
`;

const bad2 = `
bad.identifier=true
`;

const comment = `
#STRING=local
`;
