class enumCache {
  constructor() {
    this.storageKey = `gmf.enum.${window.location.host}`;
  }
  get(name) {
    if (!name) return null;
    return JSON.parse(localStorage.getItem(`${this.storageKey}.${name}`));
  }
  has(name) {
    return this.get(name) !== null;
  }
  set(value) {
    if (!value) return;
    // console.log(`${this.storageKey}.${value.name}`);
    localStorage.setItem(`${this.storageKey}.${value.name}`, JSON.stringify(value));
    if (value.fields) {
      value.fields.forEach((item) => {
        localStorage.setItem(`${this.storageKey}.${value.name}:${item.name}`, JSON.stringify(item));
      });
    }
  }
  getEnum(name, item) {
    if (!name || !item) return null;
    // console.log(`${this.storageKey}.${name}:${item}`);
    return JSON.parse(localStorage.getItem(`${this.storageKey}.${name}:${item}`));
  }
  getEnumName(name, item) {
    const v = this.getEnum(name, item);
    // console.log(name,item,v);
    return v ? v.comment : '';
  }
}

export default new enumCache();