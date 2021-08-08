class Spirit {
  constructor(name) {
    this.id = ref.length;
    this.name = name;
    this.age = 0;

    // states of being
    this.alive = true;
    this.ghost = false;

    this.hp = 100;
    this.money = 0;
    this.reputation = 0;

    // buffs, debuffs
    this.fx = [];
  }

  applyTrait() {

  }

  kill() {
    if (this.alive) {
      this.alive = false;
      this.ghost = true;
    } else {
      this.ghost = false;
    }

    // identify Essence type
    // 1  : love
    // 0  : hate
    // -1 : doom
    this.essence = -1;
  }
}