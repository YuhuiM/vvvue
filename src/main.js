import Vue from './vue/vue';
import './css/index.css';

new Vue({
  el: '#app',
  data: {
    ipt: '',
    ipt2: '234'
  },
  methods: {
    switch() {
      this.ipt = [this.ipt2, this.ipt2 = this.ipt][0]
    }
  }
});
