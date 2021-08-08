window.onload = function() {

  setInterval(function() {
    if (!mouse.el || !config.dragEl) return;

    let posx = mouse.el.offsetLeft;
    let posy = mouse.el.offsetTop;
    let x = posx + 0.1 * (mouse.x - posx);
    let y = posy + 0.1 * (mouse.y - posy);

    mouse.el.style.left = x+"px";
    mouse.el.style.top = y+"px";

    let bg = ref[mouse.el.dataset.id].bg_el;
    if (bg) {
      let box = mouse.el.getBoundingClientRect();
      let cbox = ui.container.getBoundingClientRect();
      bg.style.left = box.left-cbox.left+"px";
      bg.style.top = box.top-cbox.top+"px";
    }
  }, 10);

  document.addEventListener("mousemove", function(e) {
    if (!mouse.el) return;

    mouse.x = e.pageX;
    mouse.y = e.pageY;

    let t = e.target;
    if (mouse.target != t && mouse.target) {
      mouse.target.classList.remove("active");
    }
    if (t.classList.contains("droppable")) {
      t.classList.add("active");
      mouse.target = t;
    }

    if (!config.dragEl) {
      mouse.el.style.left = mouse.x+"px";
      mouse.el.style.top = mouse.y+"px";

      let bg = ref[mouse.el.dataset.id].bg_el;
      if (bg) {
        let box = mouse.el.getBoundingClientRect();
        let cbox = ui.container.getBoundingClientRect();
        bg.style.left = box.left-cbox.left+"px";
        bg.style.top = box.top-cbox.top+"px";
      }
      return;
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
  ref.push(new Ingredient({
    name: "love",
    size: 2
  }));
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

  mouse.el = null;
  mouse.prev = { x:null,y:null };

  if (_scene == "workshop") {
    for (let i in ref) {
      let r = ref[i];
      if (r.bg_el) r.updateBg();
    }
  }
}

function css(variable, value, el) {
  let siblings = el.parentNode.getElementsByTagName("button");
  for (let i=0; i<siblings.length; i++) {
    let sib = siblings[i];
    sib.classList.remove("selected");
  }

  el.classList.add("selected");

  ui.root.style.setProperty(variable, value);

  for (let i in ref) {
    let r = ref[i];
    if (r.bg_el) r.updateBg();
  }
}

function setTheme(mode, el) {
  var variables = [
    "--bg-underlay",
    "--bg",
    "--color",
    "--highlight",
    "--blend-mode",
    "--box-bg",
    "--box-border",
    "--half-underlay"
  ];

  for (let i in variables) {
    let v = variables[i];
    css(v, "var(--"+mode+"-"+v.substring(2)+")", el);
  }
}