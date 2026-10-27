// Compound Footer Primitives:
export {
  Footer,
  FooterSocialIcon,
  FooterSocialDock,
  FooterBrandIsland,
  FooterNavColumn,
  FooterNavMatrix,
  FooterBaseline,
  type FooterProps,
  type FooterSocialDockProps,
  type FooterBrandIslandProps,
  type FooterNavColumnProps,
  type FooterNavMatrixProps,
  type FooterBaselineProps,
} from "./footer"

// Presets & Shells:
export { FooterVariant1 } from "./footer-variant-1"
export type { FooterVariant1Props } from "./footer-variant-1"

export {
  FooterVariant2,
  FooterVariant2Cta,
  FooterVariant2Deck,
} from "./footer-variant-2"
export type {
  FooterVariant2Props,
  FooterVariant2CtaProps,
  FooterVariant2DeckProps,
} from "./footer-variant-2"

export { FooterVariant3, MinimalFooter, ToolFooter } from "./footer-variant-3"
export type { FooterVariant3Props } from "./footer-variant-3"

// Compound CTA Sub-components:
export { FooterCtaVariant1, FooterCtaVariant2 } from "./cta"
export type { FooterCtaVariant1Props, FooterCtaVariant2Props } from "./cta"

// Compound Directory Deck Sub-components:
export { FooterDeckVariant1 } from "./deck"
export type { FooterDeckVariant1Props } from "./deck"

export { DeckBox1Variant1, DeckBox1Variant2 } from "./deck-box-1"
export type { DeckBox1Variant1Props, DeckBox1Variant2Props } from "./deck-box-1"

export { DeckBox2Variant1 } from "./deck-box-2"
export type { DeckBox2Variant1Props } from "./deck-box-2"

// Canonical backward-compatibility alias:
export { FooterVariant1 as SiteFooter } from "./footer-variant-1"
export type { FooterVariant1Props as SiteFooterProps } from "./footer-variant-1"
