import Ember from 'ember';
import layout from '../templates/components/sloth-loader';

const { computed, Component } = Ember;

export default Component.extend({
  layout,
  counter: 1,
  loadCount: 10,
  initialDataCount: 20,
  enableBackgroundLoad: false,
  loadInterval: 200, // 200 ms

  /*
  
  need to investigate handleScroll - dont use
  handleScroll: true,

  init() {
    this._super(...arguments);
    let { tagName, handleScroll } = this.getProperties('tagName', 'handleScroll');
    if (tagName && !handleScroll) {
      this.set('elementId', 'slothScroll');
    }
  },
  
  */

  didInsertElement() {
    this._super(...arguments);
    let { data = [], enableBackgroundLoad } = this.getProperties('data', 'enableBackgroundLoad')
    
    // if there is no data passed, we should not bind any listeners or schedulers 
    if (data.length < 1) {
      return;
    }
    
    if (enableBackgroundLoad) {
      this.scheduleBackgroundLoad();
    } else {
      
      let view = document.getElementById('slothScroll');
      $(view).on('scroll', this.checkScrollStatus.bind(this));
      //view.addEventListener('scroll', this.checkScrollStatus.bind(this));  
    }

  },

  /*
    will schedule data load using window requestIdleCallback (if available) or setTimeout
  */
  scheduleBackgroundLoad() {
    let loadInterval = this.get('loadInterval');
  
    /*
      requestIdleCallback will not be fired automatically when the tab is out of focus. 
      On that case, timeout will come into play.
    */

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.send('loadMoreData')
      }, { 
        /* 
          if requestIdleCallback is not fired withing the given `loadInterval`
          then, we can fire it forcefully
        */
        timeout: loadInterval
      });

      return;
    }

    // fallback to setTimeout
    setTimeout(() => {
      this.send('loadMoreData')
    }, loadInterval);
  },

  didRender() {
    this._super(...arguments);
    
    let { data = [], enableBackgroundLoad = false, dataForCurrentView = [] } = this.getProperties('data', 'enableBackgroundLoad', 'dataForCurrentView');
    let isDoneRenderingList = dataForCurrentView.length === data.length;
    
    if (enableBackgroundLoad) {
    
      if (!isDoneRenderingList) {
        this.scheduleBackgroundLoad();
      }
    
    } else {
      
      let view = document.getElementById('slothScroll');
      if (isDoneRenderingList) {
        $(view).off('scroll');
        return;
      }
      $(view).on('scroll', this.checkScrollStatus.bind(this));
    
    }
  },
  
  checkScrollStatus() {
    let view = document.getElementById('slothScroll');
    // start to load data on 3/2 scroll
    if (view.scrollTop > (view.scrollHeight / 3) * 2) {
      this.send('loadMoreData');
    }
  },
  
  dataForCurrentView: computed({
    get() {
      let { data: entireData = [], initialDataCount } = this.getProperties('data', 'initialDataCount');
      let newDataList = entireData.slice(0, initialDataCount);
      return newDataList;
    },
    set(key, value) {
      return value;
    }
  }),

  // remove any binded listeners on destroy
  willDestroyElement() {
    let view = document.getElementById('slothScroll');
    $(view).off('scroll');
    
    this._super(...arguments);
  },

  actions: {
    loadMoreData() {

      if (this.get('isDestroyed')) {
        return;
      }

      let { counter, data: entireData = [], loadCount, enableBackgroundLoad = false } = this.getProperties('counter', 'data', 'loadCount', 'enableBackgroundLoad');
      let newDataSet = entireData.slice(0, loadCount * (counter + 1));
      this.setProperties({
        counter: counter + 1,
        dataForCurrentView: newDataSet
      });
      
      /*
        Need to stop the scroll listening since it will trigger unwanted updates.
        The scroll event will again be attached on `didRender` hook
      */
      if (!enableBackgroundLoad) {
        let view = document.getElementById('slothScroll');
        $(view).off('scroll'); 
      }
    }
  }
});
