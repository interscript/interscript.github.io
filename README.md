# Interscript.org v2

Astro 7 + Vite 8 + Tailwind 4 + Vue 3 islands. Uses `interscript-ts` for live map exploration.

## Status

🚧 **Under active development.** Replaces the legacy `interscript/interscript.github.io` react-static site once feature parity is reached.

## Stack

- **Astro 7** — static site framework
- **Vite 8** — bundler
- **Tailwind 4** — styling (CSS-first config via `@theme` in `src/styles/global.css`)
- **Vue 3** — interactive islands (`@astrojs/vue`)
- **TypeScript 5.6** — `astro check` for type safety

## Development

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # preview build locally
```

## Project structure

```
src/
├── layouts/
│   └── Base.astro          # HTML shell, nav, footer
├── components/
│   └── MapExplorer.vue     # Vue island: live transliteration
├── pages/
│   ├── index.astro         # Home
│   ├── maps/index.astro    # Map explorer
│   └── docs/index.astro    # Docs hub
└── styles/
    └── global.css          # Tailwind import + theme tokens
```

## Roadmap

See [TODO.complete](https://github.com/interscript/interscript/tree/main/TODO.complete) for the migration checklist from the legacy site.

## License

BSD-2-Clause — Ribose Inc.
