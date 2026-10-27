# Upgrading Satisium Products

Guidelines for receiving upgrades from the upstream Satisium Starter template.

## Workflow

```bash
git remote add starter https://github.com/satisium/starter.git
git fetch starter --tags
git cherry-pick <sha>                 # or, for a file you never modified:
git checkout starter/main -- components/ui/kbd.tsx
```

## Golden Rule

Products never edit upstream files in place. If a product needs a variant, it wraps (`components/product/…`) or extends (`lib/product/…`) instead of patching. Then every upstream change applies cleanly, and `git fetch starter && git cherry-pick` is the entire upgrade.

## Releases

### 1.0.0

- Baseline Satisium Starter release: brand layer, Fumadocs docs engine, previewer & registry pipeline, template kit, analytics, tooling.
