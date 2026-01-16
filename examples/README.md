# Voltax Examples

This directory contains example applications demonstrating how to use the Voltax SDK across different programming languages and frameworks.

## Structure

```
examples/
├── nextjs/                    # Next.js/TypeScript examples
├── go/                      # Go examples (coming soon)
└── php/                     # PHP examples (coming soon)
```

## Next.js Examples

### Next.js LibertePay Demo

A complete Next.js application demonstrating LibertePay integration.

```bash
cd nextjs
npm install
npm run dev
```

See [nextjs/README.md](nextjs/README.md) for details.

## Adding New Examples

When adding examples for a new language:

1. Create a new directory: `examples/<framework>/`
2. Add a README.md explaining how to run the examples
3. Structure examples by provider or use case:
   - `examples/<framework>-<provider>/`
   - e.g., `examples/gin/`
