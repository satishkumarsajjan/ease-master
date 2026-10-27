// Presets
export { PricingVariant1 } from "./pricing-variant-1"
export type { PricingVariant1Props } from "./pricing-variant-1"
export { PricingVariant2 } from "./pricing-variant-2"
export type { PricingVariant2Props } from "./pricing-variant-2"
export { PricingVariant3 } from "./pricing-variant-3"
export type { PricingVariant3Props } from "./pricing-variant-3"
export { PricingVariant4 } from "./pricing-variant-4"
export type { PricingVariant4Props } from "./pricing-variant-4"

// Shared Micro-Primitives & Data Fixtures
export {
  PRICING_FAQS,
  TEAM_FAQS,
  CADENCE_ORDER,
  FeatureIcon,
  FormattedFeatureText,
  SlidingSuffix,
  parseFeature,
} from "./pricing-shared"

// Variant 1 Compound Primitives (3-Column Layout)
export {
  PricingV1Controls,
  type PricingV1ControlsProps,
  PricingV1CardGrid,
  type PricingV1CardGridProps,
  PricingV1Card,
  type PricingV1CardProps,
  PricingV1Enterprise,
  type PricingV1EnterpriseProps,
  PricingV1Faq,
  type PricingV1FaqProps,
} from "./pricing-variant-1"

// Variant 2 Compound Primitives (2-Column Comparative Layout)
export {
  PricingV2CompareGrid,
  type PricingV2CompareGridProps,
  PricingV2CompareCard,
  type PricingV2CompareCardProps,
} from "./pricing-variant-2"

// Variant 3 Compound Primitives (Swiss Spec Matrix & Comparative Table)
export {
  MATRIX_CATEGORIES,
  type MatrixCategory,
  type MatrixRow,
  PricingV3SpecCell,
  PricingV3DualCards,
  type PricingV3DualCardsProps,
  PricingV3MatrixTable,
  type PricingV3MatrixTableProps,
} from "./pricing-variant-3"

// Variant 4 Compound Primitives (Dynamic Team Seat Configurator)
export {
  TEAM_DELIVERABLES,
  SEAT_PRESETS,
  calculateVolumeEconomics,
  SquircleSlider as PricingSeatSlider,
  type SquircleSliderProps as PricingSeatSliderProps,
  PricingV4CadenceSwitcher,
  type PricingV4CadenceSwitcherProps,
  PricingV4Deliverables,
  PricingV4SeatConfigurator,
  type PricingV4SeatConfiguratorProps,
  PricingV4OrderLedger,
  type PricingV4OrderLedgerProps,
} from "./pricing-variant-4"

// Core Compound Architecture Primitives
export {
  Pricing,
  type PricingProps,
  PricingProvider,
  type PricingProviderProps,
  usePricing,
  type PricingContextValue,
  PricingHeader,
  type PricingHeaderProps,
  PricingEyebrow,
  type PricingEyebrowProps,
  PricingTitle,
  type PricingTitleProps,
  PricingDescription,
  type PricingDescriptionProps,
  PricingCadenceToggle,
  type PricingCadenceToggleProps,
  PricingAudienceToggle,
  type PricingAudienceToggleProps,
  PricingGrid,
  type PricingGridProps,
  PricingCard,
  type PricingCardProps,
  PricingCardHeader,
  type PricingCardHeaderProps,
  PricingCardPrice,
  type PricingCardPriceProps,
  PricingCardFeatures,
  type PricingCardFeaturesProps,
  PricingCardFeature,
  type PricingCardFeatureProps,
  PricingCardAction,
  type PricingCardActionProps,
  PricingEnterprise,
  type PricingEnterpriseProps,
  PricingEnterpriseCard,
  type PricingEnterpriseCardProps,
  PricingEnterpriseFeatures,
  type PricingEnterpriseFeaturesProps,
  PricingEnterpriseFeature,
  type PricingEnterpriseFeatureProps,
  PricingFaq,
  type PricingFaqProps,
  PricingFaqHeader,
  type PricingFaqHeaderProps,
  PricingFaqTitle,
  type PricingFaqTitleProps,
  PricingFaqDescription,
  type PricingFaqDescriptionProps,
  PricingFaqList,
  type PricingFaqListProps,
  PricingFaqItem,
  type PricingFaqItemProps,
} from "./pricing"
