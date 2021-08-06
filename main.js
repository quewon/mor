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
  ref.push(new Ingredient({ name: "water" }));

};

var bank = {
  ingredients: {
    "water": {
      location: [],
    },
    "seeker": {
      location: ["garden"],
    },
    "muck": {
      location: [],
    }
  },

  vendors: {
    "dummy": {
      spirit: 1,
      selling: [],
      location: ["market"],
    }
  },
};