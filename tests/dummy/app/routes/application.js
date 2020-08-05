import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let data = []
    for(let i = 0; i < 5000; i++) {
      data.push({
        id: i,
        title: `Title for ${i}`
      });
    }
    return data;
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
