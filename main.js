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

  scene("workshop");

  ref.push(new Spirit("you"));
  ref.push(new Spirit("dummy"));
  ref.push(new Ingredient({
    name: "water",
    size: 6
  }));
  ref.push(new Ingredient(bank.ingredients.peach));
  ref.push(new Ingredient(bank.ingredients.crumbs));
  ref.push(new Ingredient(bank.ingredients.crumbs));
  ref.push(new Ingredient(bank.ingredients.love));
};

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

  // name combinations
  t: {
    "peach juice": ["water", "peach"],
    "breadwater": ["water", "crumbs"],
    "muck": ["ash", "water"],
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

// lol
var _repeating = [
  "000000000000",
  "111111111111",
  "222222222222",
  "333333333333",
  "444444444444",
  "555555555555",
  "666666666666",
  "777777777777",
  "888888888888",
  "999999999999"
];

function scene(name) {
  if (_scene == name) return;

  if (_scene) {
    ui[_scene].classList.remove("on");
    ui[_scene+"_button"].classList.remove("selected");
    ui[_scene].classList.remove("in");
    ui[_scene].classList.add("out");
  }

  _scene = name;

  ui[_scene].classList.remove("out");
  ui[name].classList.add("on");
  ui[name+"_button"].classList.add("selected");
  ui[name].classList.add("in");
}