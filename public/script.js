const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
  el: '#app', //where to anchor vue object in DOM
  data: {
    total: 0,
    items: [],
    results: [],
    cart: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE

  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      this.lastSearch = this.newSearch;
      this.items = [];
      this.results = [];
      this.loading = true;
      this.$http.get('/search/'.concat(this.newSearch))
      .then(function(res) {

        this.results = res.data;
        this.appendItems();
        this.loading = false;
      });
    },
    addItem: function(index) {
      this.total += 9.99;
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++;
          found = true
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {
      //returns a string with '$' attached to the beginning
      //toFixed() specifies the number of decimal places to round to
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function() {
    this.onSubmit();
    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  },
  computed: {
    noMoreItems: function() {
      return this.results.length === this.items.length && this.results.length > 0;
    }
  }
});
