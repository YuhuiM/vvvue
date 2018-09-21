export default class Vue {
  constructor(option) {
    if (!option.el) return;
    this.$el = document.querySelector(option.el);
    this.data = option.data || {};
    this.$methods = option.methods || {};
    this.$binding = {};
    this.init()
  }

  init() {
    this.obs();
    this.complie(this.$el);
    Object.keys(this.$binding).forEach(key => this.$binding[key].forEach(b => b.update()));
  }

  obs() {
    let that = this;
    this.$data = new Proxy(this.data, {
      set(target, key, value) {
        let val = Reflect.set(target, key, value);
        that.$binding[key].forEach(x => x.update());
        return val;
      }
    });
  }

  complie(node) {
    let nodes = Array.from(node.children);
    nodes.forEach(n => {
      if (n.children.length) this.complie(n);
      const vModel = n.getAttribute('v-model');
      if (vModel) {
        this.pushWatcher(new Watcher(n, 'value', this.$data, vModel));
        n.addEventListener('input', () => this.$data[vModel] = n.value);
      }
      const vBind = n.getAttribute('v-bind');
      if (vBind) {
        this.pushWatcher(new Watcher(n, 'innerHTML', this.$data, vBind));
      }
      const vClick = n.getAttribute('v-click');
      if (vClick) {
        n.addEventListener('click', () => this.$methods[vClick] && this.$methods[vClick].call(this.$data))
      }
    });
  }

  pushWatcher(watcher) {
    if (!this.$binding[watcher.key]) this.$binding[watcher.key] = [];
    this.$binding[watcher.key].push(watcher)
  }
}

class Watcher {
  constructor(node, attr, data, key) {
    this.node = node;
    this.attr = attr;
    this.data = data;
    this.key = key;
  }

  update() {
    this.node[this.attr] = this.data[this.key];
  }
}

