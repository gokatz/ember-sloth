import Ember from 'ember';
import layout from '../templates/components/sloth-loader';

const { computed, Component } = Ember;

export default Component.extend({
  layout,
  counter: 1,
  loadCount: 10,
  initialDataCount: 20,
  elementId: 'scrollView',
  didInsertElement() {
    this._super(...arguments);
    let view = document.getElementById('scrollView');
    $(view).on('scroll', this.checkScrollStatus.bind(this));
    //view.addEventListener('scroll', this.checkScrollStatus.bind(this));
  },
  checkScrollStatus() {
    let view = document.getElementById('scrollView');
    if (view.scrollTop > (view.scrollHeight / 3) * 2) {
      this.send('loadMoreData');
    }
  },
  dataForCurrentView: computed({
    set(key, value) {
      return value;
    },
    get() {
      let entireData = this.get('model');
      let loadCount = this.get('loadCount');
      let initialDataCount = this.get('initialDataCount');
      let newDataList = entireData.slice(0, (loadCount + (initialDataCount - loadCount)));
      return newDataList;
    }
  }),

  actions: {
    loadMoreData() {
      let counter = this.get('counter');
      let entireData = this.get('model');
      let loadCount = this.get('loadCount');
      let newDataSet;
      let view = document.getElementById('scrollView');
      newDataSet = entireData.slice(0, loadCount * (counter + 1));
      this.set('counter', counter + 1);
      this.set('dataForCurrentView', newDataSet);
      if (newDataSet.length === entireData.length) {
        $(view).off('scroll');
        return;
      }
    }
  }
});
