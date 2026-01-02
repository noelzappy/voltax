# Voltax Documentation

This is the documentation site for Voltax, the unified payment SDK for Africa. Built with [Starlight](https://starlight.astro.build).

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Structure

```
docs/
├── src/
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx          # Homepage
│   │       ├── guides/            # User guides
│   │       │   ├── getting-started.md
│   │       │   ├── concepts.md
│   │       │   ├── payments.md
│   │       │   ├── error-handling.md
│   │       │   ├── paystack.md
│   │       │   ├── flutterwave.md
│   │       │   ├── hubtel.md
│   │       │   └── example.md
│   │       └── reference/         # API Reference (auto-generated)
│   │           ├── classes/
│   │           ├── enumerations/
│   │           ├── functions/
│   │           ├── interfaces/
│   │           ├── type-aliases/
│   │           └── variables/
│   └── assets/
├── astro.config.mjs
└── package.json
```

## API Reference

The API reference is auto-generated from TypeScript source code using [starlight-typedoc](https://github.com/HiDeoo/starlight-typedoc). Run the build to regenerate documentation:

```bash
npm run build
```

## Contributing

When adding new documentation:

1. Add markdown files to `src/content/docs/guides/`
2. Update sidebar in `astro.config.mjs`
3. Use Starlight components for enhanced formatting
