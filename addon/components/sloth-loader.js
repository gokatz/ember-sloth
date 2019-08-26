import Ember from 'ember';
import layout from '../templates/components/sloth-loader';

const { computed, Component } = Ember;

export default Component.extend({
  layout,
  loadCount: 10,
  initialDataCount: 20,
  enableBackgroundLoad: false,
  loadInterval: 200, // 200 ms
  scrollContainer: 'slothScroll',

  _scrollElement: computed('scrollContainer', function() {
    let scrollContainer = this.get('scrollContainer');
    // refering document here as the container need not to be inside this loader
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

    // if there is no data passed, we should not bind any listeners or apply schedulers on initial render itself
    if (this.getWithDefault('data', []).length < 1) {
      return;
    }

    // to refer the bounded callback while on and off listeners
    this.boundedCheckScrollStatus = this.checkScrollStatus.bind(this);

    this._bootListeners();
  },

  /*
    will schedule data load using
    window requestIdleCallback (if available) or setTimeout
  */
  scheduleBackgroundLoad() {
    let loadInterval = this.get('loadInterval');

    /*
      NOTE: requestIdleCallback will not be fired automatically when the tab is out of focus.
      On that case, timeout will come into play.
    */

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this._loadMoreData();
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
      this._loadMoreData();
    }, loadInterval);
  },

  didRender() {
    this._super(...arguments);
    this._bootListeners();
  },

  checkScrollStatus() {
    let scrollElement = this.get('_scrollElement');
    // start to load data on 2/3 scroll
    // let isScrollThresholdreached = scrollElement.scrollTop > (scrollElement.scrollHeight / 3) * 2;
    let heightBenethViewport = scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop;
    let isScrollThresholdreached = heightBenethViewport <= scrollElement.scrollHeight * (2/3);
    // let isFullyScrolled = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight;
    if (isScrollThresholdreached) {
      this._loadMoreData();
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

  _bootListeners() {
    if (this.get('enableBackgroundLoad')) {
      this.scheduleBackgroundLoad();
    } else {
      this._onScrollListener();
    }
  },

  // scroll listener controls
  _offScrollListener() {
    let { enableBackgroundLoad, _scrollElement } = this.getProperties('enableBackgroundLoad', '_scrollElement');
    if (!enableBackgroundLoad) {
      _scrollElement.removeEventListener('scroll', this.boundedCheckScrollStatus);
    }
  },

  _onScrollListener() {
    let { isDestroyed, _scrollElement } = this.getProperties('isDestroyed', '_scrollElement');
    if (!isDestroyed) {
      _scrollElement.addEventListener('scroll', this.boundedCheckScrollStatus);
    }
  },


  /*
    Remove any bounded listeners on destroy
    * Removing only scroll listeners as requestIdleCallback and setTimeout will be called only once
  */
  willDestroyElement() {
    this._offScrollListener();
    this._super(...arguments);
  },

  _loadMoreData() {
    if (!this.get('isDestroyed')) {
      this.send('loadMoreData')
    }
  },

  isDoneRenderingList: computed('data.[]', 'dataForCurrentView.[]', function() {
      let {
        data: entireData = [],
        dataForCurrentView = [] ,
      } = this.getProperties('data', 'dataForCurrentView');

    return dataForCurrentView.length === entireData.length;
  }),

  actions: {
    loadMoreData() {

      let {
        data: entireData = [],
        loadCount,
        dataForCurrentView = [] ,
        isDoneRenderingList = false
      } = this.getProperties('data', 'loadCount', 'dataForCurrentView', 'isDoneRenderingList');

      if (isDoneRenderingList) {
        return;
      }

      let newDataSet = entireData.slice(0, dataForCurrentView.length + loadCount);

      this.set('dataForCurrentView', newDataSet);

      /*
        Need to stop the scroll listening until the current data set renders completely
        since it will trigger unwanted updates.

        The scroll event will again be attached on `didRender` hook
      */
      this._offScrollListener();
    }
  }
});
