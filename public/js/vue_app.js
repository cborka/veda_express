var app = new Vue({
  el: '#app',
  data: {
    message: 'Привет, Vue!!!'
  }
})

var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Вы загрузили эту страницу: ' + new Date().toLocaleString(),
    seen: true
  },
  methods: {
    toggleMessage: function() {
      this.seen = !this.seen;
      //this.message =  'Hi'; //new Date().toLocaleString();
      //alert(this.seen);
    }
  }
})


var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Привет, Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
//alert('vue!!!'+(app.el));