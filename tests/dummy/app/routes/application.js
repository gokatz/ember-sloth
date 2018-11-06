import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return window.fetch('https://jsonplaceholder.typicode.com/photos').then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
  },

  actions: {
    toggle(type) {
      let controller = this.get('controller');

      let prop;
      if (type === 'classic') {
        prop = 'canShowClassic';
      } else if (type === 'sloth') {
        prop = 'canShowSloth';
      } else if (type === 'autosloth') {
        prop = 'canShowAutoSloth';
      }
      controller.set(prop, !controller.get(prop));
    }
  }
});
