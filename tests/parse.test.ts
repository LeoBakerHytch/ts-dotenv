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

    it('should parse string values with leading and trailing whitespace removed', () => {
        expect(parse(ok3)).toEqual({
            STRING_LEADING_WHITESPACE: 'Lorem ipsum',
            STRING_TRAILING_WHITESPACE: 'Lorem ipsum',
            STRING_SURROUNDING_WHITESPACE: 'Lorem ipsum',
        });
    });

    it('should parse single and double quoted string values', () => {
        expect(parse(ok4)).toEqual({
            STRING_SINGLE_QUOTED: 'Lorem ipsum',
            STRING_DOUBLE_QUOTED: 'Lorem ipsum',
        });
    });

    it('should preserve leading or trailing whitespace within quoted string values', () => {
        expect(parse(ok5)).toEqual({
            STRING_SINGLE_QUOTED_WHITESPACE: ' Lorem ipsum ',
            STRING_DOUBLE_QUOTED_WHITESPACE: ' Lorem ipsum ',
        });
    });

    it('should remove whitespace outside quoted string values', () => {
        expect(parse(ok6)).toEqual({
            STRING_QUOTED_LEADING_WHITESPACE: 'Lorem ipsum',
            STRING_QUOTED_TRAILING_WHITESPACE: 'Lorem ipsum',
            STRING_QUOTED_SURROUNDING_WHITESPACE: 'Lorem ipsum',
        });
    });

    it('should replace escaped newlines / carriage returns with their literal value inside double quotes', () => {
        expect(parse(ok7)).toEqual({
            STRING_DOUBLE_QUOTED_NEWLINE: 'Lorem\nipsum',
            STRING_DOUBLE_QUOTED_CARRIAGE_RETURN: 'Lorem\ripsum',
        });
    });

    it('should parse empty strings', () => {
        expect(parse(ok8)).toEqual({
            EMPTY_STRING: '',
            EMPTY_SINGLE_QUOTED_STRING: '',
            EMPTY_DOUBLE_QUOTED_STRING: '',
        });
    });

    it('should parse large number values', () => {
        expect(parse(ok9)).toEqual({
            LARGE_NUMBER: '123456789012345',
        });
    });

    it('should parse lowercase identifiers', () => {
        expect(parse(ok10)).toEqual({
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
STRING_LEADING_WHITESPACE= Lorem ipsum
STRING_TRAILING_WHITESPACE=Lorem ipsum 
STRING_SURROUNDING_WHITESPACE= Lorem ipsum 
`;

const ok4 = `
STRING_SINGLE_QUOTED='Lorem ipsum'
STRING_DOUBLE_QUOTED="Lorem ipsum"
`;

const ok5 = `
STRING_SINGLE_QUOTED_WHITESPACE=' Lorem ipsum '
STRING_DOUBLE_QUOTED_WHITESPACE=" Lorem ipsum "
`;

const ok6 = `
STRING_QUOTED_LEADING_WHITESPACE= 'Lorem ipsum'
STRING_QUOTED_TRAILING_WHITESPACE='Lorem ipsum' 
STRING_QUOTED_SURROUNDING_WHITESPACE= 'Lorem ipsum' 
`;

const ok7 = `
STRING_DOUBLE_QUOTED_NEWLINE="Lorem\\nipsum"
STRING_DOUBLE_QUOTED_CARRIAGE_RETURN="Lorem\\ripsum"
`;

const ok8 = `
EMPTY_STRING=
EMPTY_SINGLE_QUOTED_STRING=''
EMPTY_DOUBLE_QUOTED_STRING=""
`;

const ok9 = `
LARGE_NUMBER=123456789012345
`;

const ok10 = `
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
