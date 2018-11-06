<template>
  <div class="md-tabs" :class="[themeClass, tabClasses]">
    <md-whiteframe md-tag="nav" class="md-tabs-navigation" :md-elevation="mdElevation" :class="navigationClasses" ref="tabNavigation">
      <button
        v-for="header in tabList"
        :key="header.id"
        type="button"
        class="md-tab-header"
        :class="getHeaderClass(header)"
        :disabled="header.disabled"
        @click="setActiveTab(header)"
        ref="tabHeader"
        v-wave="!header.disabled" >
        <div class="md-tab-header-container">
              <slot name="header-item" :header="header">
                <md-icon v-if="header.icon">{{ header.icon }}</md-icon>
                <md-icon v-else-if="header.iconset" :md-iconset="header.iconset">{{ header.icon }}</md-icon>
                <md-icon v-else-if="header.iconSrc" :md-src="header.iconSrc"></md-icon>
                <span v-if="header.label">{{ header.label }}</span>
              </slot>
        </div>
      </button>
      <span class="md-tab-indicator" :class="indicatorClasses" ref="indicator"></span>
      <md-background v-if="mdBackground"></md-background>
    </md-whiteframe>

    <div class="md-tabs-content flex" ref="tabContent">
      <div class="md-tabs-wrapper" :style="{transform: `translate3D(-${contentWidth}, 0, 0)` }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import theme from '../../core/components/mdTheme/mixin';
  import throttle from '../../core/utils/throttle';

  export default {
    props: {
      mdFixed: Boolean,
      mdCentered: Boolean,
      mdRight: Boolean,
      mdBackground:Boolean,
      mdSwipeable: Boolean,
      mdSwipeDistance: {
        type: Number,
        default: 100
      },
      mdDynamicHeight: {
        type: Boolean,
        default: true
      },
      mdElevation: {
        type: [String, Number],
        default: 0
      }
    },
    mixins: [theme],
    data: () => ({
      tabList: {},
      activeTab: null,
      activeTabNumber: 0,
      hasIcons: false,
      hasLabel: false,
      transitionControl: null,
      transitionOff: false,
      contentHeight: '0px',
      contentWidth: '0px'
    }),
    computed: {
      tabClasses() {
        return {
          'md-dynamic-height': this.mdDynamicHeight,
          'md-transition-off': this.transitionOff
        };
      },
      navigationClasses() {
        return {
          'md-has-icon': this.hasIcons,
          'md-has-label': this.hasLabel,
          'md-fixed': this.mdFixed,
          'md-right': !this.mdCentered && this.mdRight,
          'md-centered': this.mdCentered || this.mdFixed
        };
      },
      indicatorClasses() {
        let toLeft = this.lastIndicatorNumber > this.activeTabNumber;

        this.lastIndicatorNumber = this.activeTabNumber;

        return {
          'md-transition-off': this.transitionOff,
          'md-to-right': !toLeft,
          'md-to-left': toLeft
        };
      }
    },
    methods: {
      getHeaderClass(header) {
        return {
          'md-active': this.activeTab === header.id,
          'md-disabled': header.disabled
        };
      },
      registerTab(tabData) {
        this.tabList[tabData.id] = tabData;
      },
      unregisterTab(tabData) {
        delete this.tabList[tabData.id];
      },
      updateTab(tabData) {
        this.registerTab(tabData);

        if (tabData.active) {
          if (!tabData.disabled) {
            this.setActiveTab(tabData);
          } else if (Object.keys(this.tabList).length) {
            let tabsIds = Object.keys(this.tabList);
            let targetIndex = tabsIds.indexOf(tabData.id) + 1;
            let target = tabsIds[targetIndex];

            if (target) {
              this.setActiveTab(this.tabList[target]);
            } else {
              this.setActiveTab(this.tabList[0]);
            }
          }
        }
      },
      nextTab(){
        const idList = Object.keys(this.tabList);
        var tabId='';
        if(this.activeTabNumber>=idList.length-1){
          tabId=idList[0];
        }else{
          tabId=idList[this.activeTabNumber+1];
        }
        if(tabId){
          return this.tabList[tabId];
        }
        return false;
      },
      prevTab(){
        const idList = Object.keys(this.tabList);
        var tabId='';
        if(this.activeTabNumber<=0){
          tabId=idList[idList.length-1];
        }else{
          tabId=idList[this.activeTabNumber-1];
        }
        if(tabId){
          return this.tabList[tabId];
        }
        return false;
      },
      observeElementChanges() {
        this.parentObserver = new MutationObserver(throttle(this.calculateOnWatch, 50));
        this.parentObserver.observe(this.$refs.tabContent, {
          childList: true,
          attributes: true,
          subtree: true
        });
      },
      getTabIndex(id) {
        const idList = Object.keys(this.tabList);

        return idList.indexOf(id);
      },
      calculateIndicatorPos() {
        if (this.$refs.tabHeader && this.$refs.tabHeader[this.activeTabNumber]) {
          const tabsWidth = this.$el.offsetWidth;
          const activeTab = this.$refs.tabHeader[this.activeTabNumber];
          const left = activeTab.offsetLeft;
          const right = tabsWidth - left - activeTab.offsetWidth;

          this.$refs.indicator.style.left = left + 'px';
          this.$refs.indicator.style.right = right + 'px';
        }
      },
      calculateTabsWidthAndPosition() {
        const width = this.$el.offsetWidth;
        let index = 0;

        this.contentWidth = width * this.activeTabNumber + 'px';

        for (const tabId in this.tabList) {
          const tab = this.tabList[tabId];

          tab.ref.width = width + 'px';
          tab.ref.left = width * index + 'px';
          index++;
        }
      },
      calculateContentHeight() {
        this.$nextTick(() => {
          if (Object.keys(this.tabList).length&&this.activeTab) {
            let height = this.tabList[this.activeTab].ref.$el.offsetHeight;

            this.contentHeight = height + 'px';
            if(this.mdDynamicHeight){
              this.$refs.tabContent.style.height=this.contentHeight;
            }
          }
        });
      },
      calculatePosition() {
        window.requestAnimationFrame(() => {
          this.calculateIndicatorPos();
          this.calculateTabsWidthAndPosition();
          this.calculateContentHeight();
        });
      },
      debounceTransition() {
        window.clearTimeout(this.transitionControl);
        this.transitionControl = window.setTimeout(() => {
          this.calculatePosition();
          this.transitionOff = false;
        }, 200);
      },
      calculateOnWatch() {
        this.calculatePosition();
        this.debounceTransition();
      },
      calculateOnResize() {
        this.transitionOff = true;
        this.calculateOnWatch();
      },
      setActiveTab(tag) {
        var tabData=tag;
        if(typeof tag==='string'){
          tabData=this.tabList[tag];
        }
        if(tabData&&typeof tabData==='object'){
          this.hasIcons = !!tabData.icon;
          this.hasLabel = !!tabData.label;
          this.activeTab = tabData.id;
          this.activeTabNumber = this.getTabIndex(this.activeTab);
          this.calculatePosition();
          this.$emit('click', tabData);
          this.$emit('change', this.activeTabNumber);
        }
      },
      movePrevTab(){
        this.setActiveTab(this.prevTab());
      },
      moveNextTab(){
        this.setActiveTab(this.nextTab());
      },
      isHorizontallyInside(positionX) {
        return positionX > this.mountedRect.left && positionX < this.mountedRect.left + this.mountedRect.width;
      },
      isVerticallyInside(positionY) {
        return positionY > this.mountedRect.top && positionY < this.mountedRect.top + this.mountedRect.height;
      },
      handleTouchStart(event) {
        this.mountedRect = this.$refs.tabContent.getBoundingClientRect();
        const positionX = event.changedTouches[0].clientX;
        const positionY = event.changedTouches[0].clientY;

        if (this.isHorizontallyInside(positionX) && this.isVerticallyInside(positionY)) {
          this.initialTouchPosition = positionX;
          this.canMove = true;
        }
      },
      handleTouchEnd(event) {
        if (this.canMove) {
          const positionX = event.changedTouches[0].clientX;

          const difference = this.initialTouchPosition - positionX;

          const action = difference > 0
            ? 'moveNextTab'
            : 'movePrevTab';

          if (Math.abs(difference) > this.mdSwipeDistance) {
            this[action]();
          }

          this.canMove = false;
          this.initialTouchPosition = null;
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.observeElementChanges();
        window.addEventListener('resize', this.calculateOnResize);

        if (Object.keys(this.tabList).length && !this.activeTab) {
          let firstTab = Object.keys(this.tabList)[0];

          this.setActiveTab(this.tabList[firstTab]);
        }

        if (this.mdSwipeable) {
          this.mountedRect = this.$refs.tabContent.getBoundingClientRect();
          this.initialTouchPosition = null;
          this.canMove = false;

          document.addEventListener('touchstart', this.handleTouchStart);
          document.addEventListener('touchend', this.handleTouchEnd);
        }

      });
    },
    beforeDestroy() {
      if (this.parentObserver) {
        this.parentObserver.disconnect();
      }

      window.removeEventListener('resize', this.calculateOnResize);
      if (this.mdSwipeable) {
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchend', this.handleTouchEnd);
      }
    }
  };
</script>
