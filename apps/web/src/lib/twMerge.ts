import { extendTailwindMerge } from "tailwind-merge";

export const twMerge = extendTailwindMerge({
  override: {},
  // ↓ Extend values from the default config
  extend: {
    // ↓ Add values to existing theme scale or create a new one
    theme: {
      shadow: ["glow"],
    },
    // ↓ Add values to existing class groups or define new ones
    classGroups: {},
    // ↓ Here you can define additional conflicts across class groups
    conflictingClassGroups: {},
    // ↓ Define conflicts between postfix modifiers and class groups
    conflictingClassGroupModifiers: {},
    // ↓ Define order-sensitive modifiers
    orderSensitiveModifiers: ["my-order-sensitive-modifier"],
  },
});
