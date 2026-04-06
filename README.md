# Coffee Extraction Engine

Coffee Extraction Engine is a production-ready static React application that simulates coffee extraction entirely in the browser. The same physical model is solved with two different numerical methods, Explicit Euler and RK4, so you can directly compare how solver quality and `dt` affect the resulting cup.

The interface is in Russian, the codebase is written in TypeScript, and the build is configured for GitHub Pages deployment under a repository subpath.

## What the app does

- simulates extraction of acidity, sweetness, bitterness, and beverage volume over time
- supports Espresso, Americano, and Lungo
- solves the same ODE system using Euler, RK4, or both at once
- visualizes time-series curves, extraction phases, final flavor profile, diagnosis, and solver comparison
- includes tuned presets where Euler visibly diverges from RK4 at large `dt`

## Model overview

State vector:

```text
y = [A, S, B, V]
```

Where:

- `A` = extracted acidity
- `S` = extracted sweetness
- `B` = extracted bitterness
- `V` = beverage volume

Base dynamics:

```text
dA/dt = kA(t, p) * (Amax - A)
dS/dt = kS(t, p) * (Smax - S)
dB/dt = kB(t, p) * (Bmax - B)
dV/dt = Q(t, p)
```

Parameter vector `p` includes grind size, temperature, pressure, brew time, and drink-specific flow behavior.

The time-dependent coefficients preserve the intended qualitative behavior:

- acidity extracts early through exponential decay
- sweetness peaks in the middle through a narrow Gaussian window
- bitterness rises later through delayed growth

That narrow sweetness window is deliberate. With a large `dt`, Euler misses part of the mid-extraction peak while RK4 tracks it much more faithfully.

## Euler vs RK4

- Euler samples the derivative only at the start of each step
- RK4 samples the trajectory four times inside the same step and blends the result
- when `dt` is small, the methods approach each other
- when `dt` is large, Euler distorts sharp transitions and shifts final values more aggressively

Use the preset `Демонстрация нестабильности при большом dt` to see the difference immediately.

## Project structure

```text
src/
  components/
  interpretation/
  model/
  presets/
  simulation/
  solvers/
  types/
  utils/
```

The math/model layer is independent from React UI code, and solver implementations are interchangeable behind a common interface.

## Local development

Requirements:

- Node.js 22+
- npm 10+

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

## Production build

Build the app:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## GitHub Pages deployment

The repository includes a workflow at `.github/workflows/deploy.yml`.

It does the following:

1. checks out the repository
2. installs dependencies with `npm ci`
3. builds the site with a repository-aware base path
4. uploads `dist/` as a Pages artifact
5. deploys the artifact to GitHub Pages

To enable deployment:

1. push the repository to GitHub
2. use `main` as the default branch
3. in repository settings, enable Pages and choose `GitHub Actions` as the source
4. push to `main`

## How to change the base path

`vite.config.ts` reads `VITE_BASE_PATH`.

Examples:

- root deployment: `VITE_BASE_PATH=/`
- GitHub Pages repo deployment: `VITE_BASE_PATH=/your-repo-name/`

The included GitHub Actions workflow automatically sets:

```bash
VITE_BASE_PATH=/${{ github.event.repository.name }}/
```

This prevents broken asset URLs when the app is hosted under a repository subpath.

## Extending the simulator

The codebase is structured so it can later support:

- additional sensory dimensions such as body or aroma
- bean profiles and roast levels
- new brewing methods
- richer interpretation rules and educational content

Flavor dimensions are defined separately from the UI, which makes future expansion mechanical instead of invasive.
