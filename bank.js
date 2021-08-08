var bank = {
  ingredients: { // the atoms of this game
    "water": {
      name: "water",
      type: "water",
    },
    "crumbs": {
      name: "crumbs",
      type: "vegetable",
    },
    "muck": {
      name: "muck",
      type: "muck",
    },
    "peach": {
      name: "peach",
      type: "fruit",
    },
    "love": {
      name: "love",
      type: "e",
    },
    "doom": {
      name: "doom",
      type: "e",
    },
    "hate": {
      name: "hate",
      type: "e",
    },
    "ash": {
      name: "ash",
      type: "ash"
    },
  },

  potions: {
    "unlabeled bottle": {
      name: "unlabeled bottle",
      potion: {
        e: "",
      }
    }
  },

  // ingredients name combinations
  t: {
    "peach juice": ["water", "peach"],
    "breadwater": ["water", "crumbs"],
  },

  // type combinations
  g: {
    "soup": ["water", "vegetable"],
    "juice": ["water", "fruit"],
    "soup": ["water", "vegetable", "fruit"],
    "salad": ["vegetable", "fruit"],
    "fruits": ["fruit", "fruit"],
    "vegetables": ["vegetable", "vegetable"],
    "muck": ["ash", "fruit"],
    "muck": ["ash", "vegetable"],
    "muck": ["ash", "water"],
  },

  vendors: {
    "dummy": {
      spirit: 1,
      selling: [],
      location: ["market"],
    }
  },
};