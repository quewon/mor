window.onload = function() {

  document.addEventListener("mousemove", function(e) {
    if (!_mouseEl) return;

    let x = e.pageX;
    let y = e.pageY;
    _mouseEl.style.left = x+"px";
    _mouseEl.style.top = y+"px";

    let t = e.target;
    if (_prevT != t && _prevT) {
      _prevT.classList.remove("active");
    }
    if (t.classList.contains("droppable")) {
      t.classList.add("active");
      _prevT = t;
    }
  });

  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });

  ref.push(new Spirit("you"));
  ref.push(new Spirit("dummy"));
  ref.push(new Ingredient({
    name: "water",
    size: 6
  }));
  ref.push(new Ingredient(bank.ingredients.water));
  ref.push(new Ingredient(bank.ingredients.nectarine));
  ref.push(new Ingredient(bank.ingredients.ariadne));
  ref.push(new Ingredient(bank.ingredients.ariadne));
};

var bank = {
  ingredients: {
    "water": {
      name: "water",
      type: "water",
    },
    "ariadne": {
      name: "ariadne",
      type: "vegetable",
    },
    "muck": {
      name: "muck",
      type: "muck",
    },
    "nectarine": {
      name: "nectarine",
      type: "fruit",
    },
    "love": {
      name: "love",
      type: "essence",
    },
    "doom": {
      name: "doom",
      type: "essence",
    },
    "hate": {
      name: "hate",
      type: "essence",
    }
  },

  t: {
    "peach juice": ["water", "nectarine"],
    "ariadne soup": ["water", "ariadne"],
  },

  g: {
    "soup": ["water", "vegetable"],
    "juice": ["water", "fruit"],
    "soup": ["water", "vegetable", "fruit"],
    "salad": ["vegetable", "fruit"],
    "fruits": ["fruit"],
    "vegetables": ["vegetable"],
  },

  vendors: {
    "dummy": {
      spirit: 1,
      selling: [],
      location: ["market"],
    }
  },
};