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

    let bg = ref[_mouseEl.dataset.id].bg_el;
    if (bg) {
      let box = _mouseEl.getBoundingClientRect();
      let cbox = ui.container.getBoundingClientRect();
      bg.style.left = box.left-cbox.left+"px";
      bg.style.top = box.top-cbox.top+"px";
    }
  });

  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });

  setInterval(function() {

    for (let i in ref) {
      let r = ref[i];
      if (r.el) {
        r.tick();
      }
    }

  }, config.tickSpeed);

  ref.push(new Spirit("you"));
  ref.push(new Spirit("dummy"));
  ref.push(new Ingredient({
    name: "water",
    size: 6
  }));
  ref.push(new Ingredient(bank.ingredients.peach));
  ref.push(new Ingredient(bank.ingredients.peach));
  ref.push(new Ingredient(bank.ingredients.crumbs));
  ref.push(new Ingredient(bank.ingredients.crumbs));
  ref.push(new Ingredient(bank.ingredients.love));
  ref.push(new Ingredient(bank.ingredients.love));
  ref.push(new Ingredient(bank.ingredients.love));
  ref.push(new Ingredient(bank.ingredients.love));
  ref.push(new Ingredient(bank.ingredients.love));
  ref.push(new Ingredient(bank.ingredients.love));
};

var bank = {
  ingredients: {
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

  t: {
    "peach juice": ["water", "peach"],
    "breadwater": ["water", "crumbs"],
    "muck": ["ash", "water"],
  },

  g: {
    "soup": ["water", "vegetable"],
    "juice": ["water", "fruit"],
    "soup": ["water", "vegetable", "fruit"],
    "salad": ["vegetable", "fruit"],
    "fruits": ["fruit"],
    "vegetables": ["vegetable"],
    "muck": ["ash", "fruit"],
  },

  vendors: {
    "dummy": {
      spirit: 1,
      selling: [],
      location: ["market"],
    }
  },
};