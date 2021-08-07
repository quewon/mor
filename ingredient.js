class Ingredient {
  constructor(props) {
    this.id = ref.length;
    this.name = props.name || "null";
    this.size = props.size || 1;

    this.freshness = props.freshness || 100;
    this.temperature = props.temperature || 0;

    this.densities = {};
    if (!props.densities) {
      this.addDensityValue(this.name, this.size);
    } else {
      for (let name in props.densities) {
        this.addDensityValue(name, props.densities[name]);
      }
    }

    this.move(props.container || "fridge");
  }

  removeEl() {
    if (this.el) {
      this.el.remove();

      let array = game.workshop[this.container];
      array.splice(array.indexOf(this.id), 1);

      this.el = null;

      if (this.bg_el) {
        this.bg_el.remove();
        this.bg_el = null;
      }
    }
  }

  addDensityValue(name, value) {
    if (!(name in this.densities)) this.densities[name] = 0;
    this.densities[name] += value;

    if (this.densities[name] < 0) {
      this.densities[name] = 0;
    }
  }

  move(container, x, y, replaceId) {
    // remove from previous container
    this.removeEl();

    // create new el
    let el = document.createElement("tr");
    el.dataset.id = this.id;
    el.style.width = this.size+0.5+"em";
    el.style.height = this.size+0.5+"em";
    if (x && y) {
      el.style.left = x+"px";
      el.style.top = y+"px";
    }
    el.className = "handwritten draggable droppable";

    let name = document.createElement("th");
    name.textContent = this.name;
    el.appendChild(name);

    let sum_th = document.createElement("th");
    sum_th.textContent = this.size;
    el.appendChild(sum_th);

    el.addEventListener("mouseup", function(e) {
      var i = ref[this.dataset.id];

      switch (e.which) {
        case 1: //lmb

          let el = i.el;
          _prevPos = {
            x: parseInt(el.style.left),
            y: parseInt(el.style.top)
          };

          i.pickup(e);

          break;
        case 3: //rmb

          i.pickupHalf(e);

          break;
      };
    });

    if (replaceId) {
      let r = ref[replaceId];
      el.style.left = r.el.style.left;
      el.style.top = r.el.style.top;
      ui[r.container].insertBefore(el, r.el);
      r.removeEl();
    } else {
      ui[container].appendChild(el);
    }
    game.workshop[container].push(this.id);
    this.container = container;

    // bg

    let bg = document.createElement("span");
    bg.className = "bg";

    bg.style.borderRadius = getComputedStyle(el).getPropertyValue("border-radius");
    ui.container.appendChild(bg);

    this.el = el;
    this.bg_el = bg;

    for (let i in ref) {
      let r = ref[i];
      if (r.bg_el) r.updateBg();
    }
  }

  updateBg() {
    let dtotal = 0;
    let names = 0;
    for (let name in this.densities) {
      names++;
      dtotal += this.densities[name];
    }

    while (this.bg_el.childNodes.length != names) {
      let l = this.bg_el.childNodes.length;
      if (l < names) {
        let layer = document.createElement("div");
        this.bg_el.appendChild(layer);
      } else if (l > names) {
        this.bg_el.lastElementChild.remove();
      }
    }

    let i = 0;
    let children = this.bg_el.childNodes;
    // let light = 0;
    for (let name in this.densities) {
      children[i].className = bank.ingredients[name].type;
      let opacity = this.densities[name] / dtotal;
      // opacity = opacity + opacity * light;
      // light += this.densities[name] / dtotal;
      children[i].style.opacity = opacity;
      i++;
    }

    if (this.el.parentNode.tagName == "TABLE") {
      this.bg_el.style.display = "none";
    }

    this.bg_el.style.width = this.el.offsetWidth+"px";
    this.bg_el.style.height = this.el.offsetHeight+"px";

    let elbox = this.el.getBoundingClientRect();
    let cbox = ui.container.getBoundingClientRect();

    this.bg_el.style.top = elbox.top-cbox.top+"px";
    this.bg_el.style.left = elbox.left-cbox.left+"px";
  }

  pickup(e) {
    if (_mouseEl) {
      let r = ref[_mouseEl.dataset.id];

      this.mix(r.id);

      r.removeEl();

      _mouseEl = null;
      document.onmouseup = null;
      if (_prevT) _prevT.classList.remove("active");
    } else {
      this.removeEl();

      let el = document.createElement("span");
      el.dataset.id = this.id;
      el.className = "dragging handwritten";
      el.style.width = this.size+0.5+"em";
      el.style.height = this.size+0.5+"em";
      let name = document.createElement("span");
      name.textContent = this.name;
      el.appendChild(name);
      document.body.appendChild(el);

      let bg = document.createElement("span");
      bg.className = "bg";
      bg.style.borderRadius = getComputedStyle(el).getPropertyValue("border-radius");
      ui.container.appendChild(bg);

      this.bg_el = bg;
      this.el = el;

      let x = e.pageX;
      let y = e.pageY;

      this.el.classList.add("dragging");
      this.el.style.left = x+"px";
      this.el.style.top = y+"px";

      _mouseEl = this.el;
      
      setTimeout(function(e) {
        document.onmouseup = function(e) {
          let i = ref[_mouseEl.dataset.id];
          i.drop(e);
        };
      }, 1);
    }

    for (let i in ref) {
      let r = ref[i];
      if (r.bg_el) r.updateBg();
    }
  }

  pickupHalf(e) {
    if (_mouseEl) {
      document.onmouseup = null;

      let i = ref[_mouseEl.dataset.id];
      // console.log("added 1 to "+this.size);

      let drop = new Ingredient(i);
      drop.size = 1;
      drop.removeEl();
      this.mixIngredient(drop);

      this.el.style.width = this.size+0.5+"em";
      this.el.style.height = this.size+0.5+"em";
      this.el.lastElementChild.textContent = this.size;

      i.size--;

      if (i.size <= 0) {
        i.removeEl();
        _mouseEl = null;
        if (_prevT) _prevT.classList.remove("active");
      } else {
        i.el.style.width = i.size+0.5+"em";
        i.el.style.height = i.size+0.5+"em";

        setTimeout(function(e) {
          document.onmouseup = function(e) {
            let i = ref[_mouseEl.dataset.id];
            i.drop(e);
          };
        }, 1);
      }
    } else {
      let i = new Ingredient(this);
      i.size = Math.floor(i.size/2);
      for (let name in i.densities) {
        i.densities[name] /= 2;
      }
      if (i.size != 0) {
        ref.push(i);
        i.move(this.container, null, null, this.id);
        this.size -= i.size;
      } else {
        i.removeEl();
      }

      this.removeEl();

      let el = document.createElement("span");
      el.dataset.id = this.id;
      el.className = "dragging handwritten";
      el.style.width = this.size+0.5+"em";
      el.style.height = this.size+0.5+"em";
      let name = document.createElement("span");
      name.textContent = this.name;
      el.appendChild(name);
      document.body.appendChild(el);

      let bg = document.createElement("span");
      bg.className = "bg";
      bg.style.borderRadius = getComputedStyle(el).getPropertyValue("border-radius");
      ui.container.appendChild(bg);

      this.bg_el = bg;
      this.el = el;

      let x = e.pageX;
      let y = e.pageY;

      this.el.classList.add("dragging");
      this.el.style.left = x+"px";
      this.el.style.top = y+"px";

      _mouseEl = this.el;
      
      setTimeout(function(e) {
        document.onmouseup = function(e) {
          let i = ref[_mouseEl.dataset.id];
          i.drop(e);
        };
      }, 1);

      // console.log("picked up half of "+this.size);
    }

    for (let i in ref) {
      let r = ref[i];
      if (r.bg_el) r.updateBg();
    }
  }

  drop(e) {
    if (e.which == 3) {
      let target = e.target;
      if (target.id in game.workshop) {
        // console.log("dropped 1");

        let i = new Ingredient(this);
        i.size = 1;
        ref.push(i);
        let box = target.getBoundingClientRect();
        i.move(target.id, e.pageX - box.left, e.pageY - box.top);

        this.size--;
        this.el.style.width = this.size+0.5+"em";
        this.el.style.height = this.size+0.5+"em";
        if (this.size <= 0) {
          this.removeEl();
          document.onmouseup = null;
          _mouseEl = null;
          if (_prevT) _prevT.classList.remove("active");
        }
      }
    } else {
      // console.log("dropped "+this.size);

      let t = e.target;
      if (
        t.classList.contains("droppable") &&
        !t.classList.contains("draggable")
      ) {
        let box = t.getBoundingClientRect();
        this.move(t.id, e.pageX - box.left, e.pageY - box.top);
      } else {
        this.move(this.container, _prevPos.x, _prevPos.y);
      }

      document.onmouseup = null;

      _mouseEl = null;
      if (_prevT) _prevT.classList.remove("active");
    }
  }

  mix(id) {
    let i = ref[id];

    this.mixIngredient(i);

    // console.log("mixed "+this.size+" and "+i.size);
  }

  mixIngredient(i) {
    this.size += i.size;
    for (let name in i.densities) {
      this.addDensityValue(name, i.densities[name])
    }

    this.update();
    i.update();
  }

  updateName() {
    let keys = [];
    for (let name in this.densities) {
      if (this.densities[name] > 0) keys.push(name);
    }

    if (keys.length == 1) {
      this.name = keys[0];
      return;
    }

    // check specific combo names
    check: for (let name in bank.t) {
      let array = bank.t[name];

      if (array.length != keys.length) continue check;

      for (let index in keys) {
        if (!array.includes(keys[index])) continue check;
      }

      // keys and array contain the same values
      this.name = name;
      return;
    }

    // specific combo not found -- fall back on general combos
    let types = [];
    for (let i in keys) {
      let name = keys[i];
      types.push(bank.ingredients[name].type);
    }
    check: for (let name in bank.g) {
      let array = bank.g[name];

      if (array.length != types.length) continue check;

      for (let index in types) {
        if (!array.includes(types[index])) continue check;
      }

      // types and array contain the same values
      this.name = name;
      return;
    }
  }

  update() {
    if (this.temperature >= config.limit) this.burn();
    if (this.freshness <= -1 * config.limit) this.rot();

    if (this.el) {
      this.el.style.width = this.size+0.5+"em";
      this.el.style.height = this.size+0.5+"em";
      this.el.lastElementChild.textContent = this.size;
      this.el.firstElementChild.textContent = this.name;
    }

    this.updateName();
  }

  tick() {
    let container = this.container;
    if (_mouseEl == this.el) container = "";

    switch (container) {
      case "fridge":

        this.temperature--;

        break;
      case "oven":

        this.temperature++;

        break;
      default:

        this.freshness--;

        break;
    }

    if (this.temperature < -1 * config.limit/2)
      this.temperature = -1 * config.limit/2;
    if (this.temperature > config.limit)
      this.temperature = config.limit;
    if (this.freshness < -1 * config.limit)
      this.freshness = -1 * config.limit;

    this.update();
  }

  rot() {

  }

  burn() {
    this.name = "ash";

    for (let name in this.densities) {
      if (
        bank.ingredients[name].type == "water" ||
        bank.ingredients[name].type == "e"
      ) {
        this.size -= this.densities[name];
        bank.ingredients[name] = 0;
      }
    }

    if (this.size <= 0) {
      this.removeEl();
      this.el = null;
    }

    this.densities = {};
    this.addDensityValue("ash", this.size);

    this.updateBg();
  }
}