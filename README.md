# ts-dotenv

Strongly-typed Node.js environment variables from `.env` and `process.env`.

[![Version](https://badgen.net/npm/v/ts-dotenv)](https://npmjs.org/package/ts-dotenv)
[![License](https://badgen.net/github/license/LeoBakerHytch/ts-dotenv)](https://github.com/LeoBakerHytch/ts-dotenv/blob/master/LICENSE)
[![Coveralls](https://badgen.net/coveralls/c/github/LeoBakerHytch/ts-dotenv)](https://coveralls.io/github/LeoBakerHytch/ts-dotenv)

## Motivation

Load environment variables from a `.env` file for development, but deploy to an environment that injects them directly
(on `process.env`) with no logic needed to differentiate dev from prod. Values from disk are merged with the process
environment (you decide whether `process.env` or `.env` takes precedence), validated against a simple schema, and
coerced to the appropriate types.

`ts-dotenv` maintains [dev/prod parity][0] by not caring whether variables come from `.env` or `process.env`, as long as
they’re all present and the correct types. Otherwise, it fails fast, so your alarms should start going off and/or your
rolling releases will abort. The thrown error details which variables are missing or have the wrong types.

**Caution**: Be careful removing variables from your prod environment; be sure to first remove them from the schema,
otherwise your server won’t boot and it will have nothing to roll back to. (Or you could catch the error `ts-dotenv`
throws, and do your own logging or alerts, but you’ll lose automatic protection from pushing out builds with missing
variables. It’s a trade-off.)

[0]: https://12factor.net/dev-prod-parity

## Usage

```dotenv
# Comments are supported
TRACING=true
PORT=3000
NODE_ENV=production
APP_NAME=test-app
BASE_URL=https://api.example.com
#BASE_URL=https://development-api.example.com
BASE64_ENCODED=8J+agA==
EXTRA=true
```

```typescript
import { strict as assert } from 'assert';
import { load } from 'ts-dotenv';

const env = load({
    TRACING: Boolean,
    PORT: Number,
    APP_NAME: /^[-a-z]+$/,
    BASE_URL: String,
    NODE_ENV: ['production' as const, 'development' as const],
    BASE64_ENCODED: Buffer,
});

assert.ok(env.TRACING === true);
assert.ok(env.PORT === 3000);
assert.ok(env.APP_NAME === 'test-app');
assert.ok(env.NODE_ENV === 'production');
assert.ok(env.BASE_URL === 'https://api.example.com');
assert.ok(env.BASE64_ENCODED === Buffer.from('🚀'));
assert.ok(env.EXTRA === undefined);
```

Note:

-   `Number` only supports integers
-   Only string unions are supported
-   Use `as const` with string unions, to ensure a proper resulting environment type
-   All values may be surrounded by leading and / or trailing whitespace, which is ignored (unless it’s quoted: see below)

### Strings

Strings may be single- or double-quoted. Leading and / or trailing whitespace is ignored, unless it’s inside the quotes.

```dotenv
UNQUOTED= Lorem ipsum
SINGLE_QUOTED= 'Lorem ipsum'
DOUBLE_QUOTED= "Lorem ipsum"
QUOTED_WITH_PRESERVED_WHITESPACE= " Lorem ipsum "
```

Within double quotes, escaped newlines (`\n`) / carriage returns (`\r`) are converted to their corresponding literal
characters.

```dotenv
DOUBLE_QUOTED_WITH_NEWLINE="Lorem\nipsum"
DOUBLE_QUOTED_WITH_CR="Lorem\ripsum"
```

### Optionals & defaults

Optional fields and default values can be defined with an extended schema specifier; for example:

```typescript
const schema = {
    TRACING: {
        type: Boolean,
        optional: true,
    },
    NODE_ENV: {
        type: String,
        default: 'local',
    },
} as const;
```

### Boot

Run `ts-dotenv` from your app’s entry, to ensure variables are loaded before you wire up services and start serving
requests. The following pattern makes for easy, type-safe consumption of variables throughout your app:

#### `index.ts`

```typescript
import { loadEnv } from './env';

loadEnv(); // Executed synchronously before the rest of your app loads

require('./server'); // Your server’s actual entry
```

#### `env.ts`

```typescript
import { EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
    NODE_ENV: String,
};

export let env: Env;

export function loadEnv(): void {
    env = load(schema);
}
```

#### `example-module.ts`

```typescript
import { env } from './env';

if (env.NODE_ENV === 'production') {
    // ...
}
```

### Options

By default:

-   Values in `process.env` take precedence
-   `.env` is the expected file name, loaded from the working directory

Change this through options:

```typescript
import { resolve } from 'path';
import { load } from 'ts-dotenv';
const env = load(schema, 'lib/.env');
```

```typescript
import { resolve } from 'path';
import { load } from 'ts-dotenv';

const env = load(schema, {
    path: resolve(__dirname, '.env'),
    encoding: 'iso-8859-1',
    overrideProcessEnv: true,
});
```

## Acknowledgements

This was inspired by [`dotenv`][1] and [`dotenv-extended`][2], but written for first-class use in a TypeScript project.

[1]: https://www.npmjs.com/package/dotenv
[2]: https://www.npmjs.com/package/dotenv-extended
