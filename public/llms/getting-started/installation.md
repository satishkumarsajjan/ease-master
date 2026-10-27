# Installation & Quickstart

> Clone the template, choose your product preset, and boot the development server.

<PromptBlock
  title="Agent Prompt"
  prompt="Read PRODUCTION_READINESS_PLAN.md, run pnpm setup, and initialize the project."
/>

<Steps>
  <Step title="Clone and install dependencies">
    Clone the template repository into your new product directory:

    ```bash
    git clone https://github.com/satisium/starter.git my-product
    cd my-product
    pnpm install
    ```

  </Step>

  <Step title="Configure your product with pnpm setup">
    Run the interactive Satisium product scaffolder:

    ```bash
    pnpm setup
    ```

    The CLI will ask for:
    1. **Product Name** (e.g. `Tweak`)
    2. **Production Domain** (e.g. `https://tweak.satisium.com`)
    3. **Preset Choice**:
       * `tool` — Interactive workstation canvas + product docs
       * `ui` — Component library + Shadcn registry + live previewer

    <Callout type="info">
      Non-interactive mode for CI or scripts:
      <code>pnpm setup --name "Tweak" --slug tweak --domain https://tweak.satisium.com --preset tool</code>
    </Callout>

  </Step>

  <Step title="Start the development server">
    Launch the Next.js Turbopack development server:

    ```bash
    pnpm dev
    ```

    * Visit [http://localhost:3000](http://localhost:3000) for your curated landing page.
    * Visit `/app` for your product workstation canvas.
    * Visit `/docs` for your Fumadocs documentation engine.

  </Step>
</Steps>

## The Zero-Key Rule

The Satisium Starter adheres to a strict **zero-key rule**: every environment variable in `.env.example` is optional.
A fresh clone with an empty `.env.local` will boot, build, and pass all tests out-of-the-box. When you are ready to configure analytics or telemetry, add keys to `.env.local`:

```bash
cp .env.example .env.local
```

## Architectural Health Check

Verify your setup at any time with the 13-point Satisium architectural auditor:

```bash
pnpm check:doctor
```
