
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
    //message: 'Привет, Vue.js!',
    messagez: 'Привет, Vue.jz!'
  },
  methods: {
    reverseMessage: function () {
      this.messagez = 'Привет, Vue.js!'
      alert('vue!!!'+(this.messagez));
      //this.message = this.message.split('').reverse().join('')
    }
  }
})


var app7 = new Vue({
  el: '#app-7',
  data: {
    mess: 'Привет, 7!'
  }
})
//alert('vue!!!'+(app.el));