import Ember from 'ember';
import layout from '../templates/components/sloth-loader';

const { computed, Component } = Ember;

export default Component.extend({
  layout,
  counter: 1,
  loadCount: 10,
  initialDataCount: 20,
  handleScroll: true,
  containerId: 'slothScroll',

  init() {
    this._super(...arguments);
    if (this.get('tagName') && !this.get('handleScroll')) {
      this.set('elementId', this.get('containerId'));
    }
  },

  _getScrollView() {
    return document.getElementById(this.get('containerId'));
  },

  didInsertElement() {
    this._super(...arguments);
    let view = this._getScrollView();
    $(view).on('scroll', this.checkScrollStatus.bind(this));
    //view.addEventListener('scroll', this.checkScrollStatus.bind(this));
  },

  didRender() {
    this._super(...arguments);
    let view = this._getScrollView();
    if (this.get('dataForCurrentView').length === this.get('data').length) {
      $(view).off('scroll');
      return;
    }
    $(view).on('scroll', this.checkScrollStatus.bind(this));
  },
  checkScrollStatus() {
    let view = this._getScrollView();    
    if (view.scrollTop > view.scrollHeight * (this.get('threshold') / 100)) {
      this.send('loadMoreData');
    }
  },
  dataForCurrentView: computed({
    set(key, value) {
      return value;
    },
    get() {
      let entireData = this.get('data');
      let loadCount = this.get('loadCount');
      let initialDataCount = this.get('initialDataCount');
      let newDataList = entireData.slice(0, (loadCount + (initialDataCount - loadCount)));
      return newDataList;
    }
  }),

  actions: {
    loadMoreData() {
      console.log('Data loaded');
      
      let counter = this.get('counter');
      let entireData = this.get('data');
      let loadCount = this.get('loadCount');
      let view = this._getScrollView();
      let newDataSet;
      // console.log(loadCount * (counter + 1));
      newDataSet = entireData.slice(0, loadCount * (counter + 1));
      this.setProperties({
        counter: counter + 1,
        dataForCurrentView: newDataSet
      });
      $(view).off('scroll');
    }
  }
});
