import Ember from 'ember';
import layout from '../templates/components/sloth-loader';

const { computed, Component } = Ember;

export default Component.extend({
  layout,
  loadCount: 10,
  initialDataCount: 20,
  enableBackgroundLoad: false,
  loadInterval: 200, // 200 ms,
  scrollContainer: 'slothScroll',

  _scrollElement: computed('scrollContainer', function() {
    let scrollContainer = this.get('scrollContainer');
    return document.getElementById(scrollContainer);
  }),

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
    
    // if there is no data passed, we should not bind any listeners or apply schedulers 
    if (data.length < 1) {
      return;
    }
    
    if (enableBackgroundLoad) {
      this.scheduleBackgroundLoad();
    } else {
      let scrollElement = this.get('_scrollElement');
      this.boundedCheckScrollStatus = this.checkScrollStatus.bind(this);
      scrollElement.addEventListener('scroll', this.boundedCheckScrollStatus);  
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
    
    let {
      data = [],
      enableBackgroundLoad = false,
      dataForCurrentView = []
    } = this.getProperties('data', 'enableBackgroundLoad', 'dataForCurrentView');
    
    let isDoneRenderingList = dataForCurrentView.length === data.length;
    
    if (enableBackgroundLoad) {
    
      if (!isDoneRenderingList) {
        this.scheduleBackgroundLoad();
      }
    
    } else {
      
      let scrollElement = this.get('_scrollElement');
      if (isDoneRenderingList) {
        scrollElement.removeEventListener('scroll', this.boundedCheckScrollStatus);  
        return;
      }
      scrollElement.addEventListener('scroll', this.boundedCheckScrollStatus);      
    }
  },
  
  checkScrollStatus() {
    let scrollElement = this.get('_scrollElement');
    // start to load data on 2/3 scroll
    if (scrollElement.scrollTop > (scrollElement.scrollHeight / 3) * 2) {
      this.send('loadMoreData');
    }
  },
  
  /* 
    Getter will be called only on initail count calculation.
    On further data lookup, the data will loade via action `loadMoreData`
  */
  dataForCurrentView: computed({
    get() {
      let { data: entireData = [], initialDataCount } = this.getProperties('data', 'initialDataCount');
      let initialDataList = entireData.slice(0, initialDataCount) || [];
      return initialDataList;
    },
    set(key, value) {
      return value;
    }
  }),

  // remove any binded listeners on destroy
  willDestroyElement() {
    let scrollElement = this.get('_scrollElement');
    scrollElement.removeEventListener('scroll', this.boundedCheckScrollStatus);  
    
    this._super(...arguments);
  },

  actions: {
    loadMoreData() {

      if (this.get('isDestroyed')) {
        return;
      }

      let { 
        data: entireData = [], 
        loadCount, 
        enableBackgroundLoad = false, 
        dataForCurrentView = [] 
      } = this.getProperties('data', 'loadCount', 'enableBackgroundLoad', 'dataForCurrentView');
      
      let newDataSet = entireData.slice(0, dataForCurrentView.length + loadCount);
      
      this.set('dataForCurrentView', newDataSet);

      /*
        Need to stop the scroll listening since it will trigger unwanted updates.
        The scroll event will again be attached on `didRender` hook
      */
      if (!enableBackgroundLoad) {
        let scrollElement = this.get('_scrollElement');
        scrollElement.removeEventListener('scroll', this.boundedCheckScrollStatus);  
      }
    }
  }
});
