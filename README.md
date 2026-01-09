# GlobalArt Ecosystem Examples

Repository with examples of using packages from the GlobalArt ecosystem for NestJS and Node.js.

## Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Installation

```bash
pnpm install
```

## Running Examples

To run a specific example, use:

```bash
pnpm --filter <example-name> dev
```

For example:

```bash
pnpm --filter swagger-example dev
pnpm --filter logger dev
```

## Important

Some examples may use local packages from the `ecosystem` repository. Make sure that the path to local packages is correctly specified in the `package.json` of the corresponding example.
