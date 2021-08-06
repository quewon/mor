class Ingredient {
  constructor(props) {
    this.id = ref.length;
    this.name = props.name || "null";
    this.size = props.size || 1;

    this.freshness = props.freshness || 100;

    this.move(props.container || "fridge");
  }

  removeEl() {
    if (this.el) {
      this.el.remove();

      let array = game.workshop[this.container];
      array.splice(array.indexOf(this.id), 1);
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

    this.el = el;
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

    console.log("picked up "+this.size);
  }

  pickupHalf(e) {
    if (_mouseEl) {
      document.onmouseup = null;

      let i = ref[_mouseEl.dataset.id];
      console.log("added 1 to "+this.size);
      this.size++;
      this.el.style.width = this.size+0.5+"em";
      this.el.style.height = this.size+0.5+"em";
      this.el.lastElementChild.textContent = this.size;

      i.size--;

      if (i.size < 1) {
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

      console.log("picked up half of "+this.size);
    }
  }

  drop(e) {
    if (e.which == 3) {
      let target = e.target;
      if (target.id in game.workshop) {
        console.log("dropped 1");

        let i = new Ingredient(this);
        i.size = 1;
        ref.push(i);
        let box = target.getBoundingClientRect();
        i.move(target.id, e.pageX - box.left, e.pageY - box.top);

        this.size--;
        this.el.style.width = this.size+0.5+"em";
        this.el.style.height = this.size+0.5+"em";
        if (this.size < 1) {
          this.removeEl();
          document.onmouseup = null;
          _mouseEl = null;
          if (_prevT) _prevT.classList.remove("active");
        }
      }
    } else {
      console.log("dropped "+this.size);

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

    console.log("mixed "+this.size+" and "+i.size);

    this.size += i.size;
    this.el.style.width = this.size+0.5+"em";
    this.el.style.height = this.size+0.5+"em";
    this.el.lastElementChild.textContent = this.size;

    i.size = this.size;
    i.el.style.width = this.el.style.width;
    i.el.style.height = this.el.style.height;
    i.el.lastElementChild.textContent = i.size;
  }

  tick() {
    this.freshness--;
  }
}