<template>
  <div class="md-snackbar md-toast" :class="[themeClass, classes]" :id="snackbarId" >
    <transition-group name="list" tag="p">
      <div 
        v-for="(item,itemInd) in toastList" 
        class="md-snackbar-container" 
        :key="item.id"
        @mouseenter="pauseTimeout(item)" 
        @mouseleave="resumeTimeout(item)">
        <div class="md-snackbar-content">
          <span v-html="item.text"></span>
        </div>
        <md-button class="md-icon-button md-toast-close" @click.native="closeItem(item)">
          <md-icon>clear</md-icon>
        </md-button>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import transitionEndEventName from '../../core/utils/transitionEndEventName';
  import theme from '../../core/components/mdTheme/mixin';

  export default {
    props: {
      id: [String, Number],
      mdPosition: {
        type: String,
        default: 'bottom center'
      },
      mdDuration: {
        type: [String, Number],
        default: 10000
      }
    },
    mixins: [theme],
    data() {
      return {
        snackbarId: this.id || 'snackbar-' + this._.uniqueId(),
        active: false,
        snackbarElement: {},
        directionClass: null,
        toastList:[],
      };
    },
    computed: {
      classes() {
        let cssClasses = {'md-active': this.active&&this.toastList.length>0};
        this.directionClass = this.mdPosition.replace(/ /g, '-');
        cssClasses['md-position-' + this.directionClass] = true;
        cssClasses['layout-column']=true;
        cssClasses['layout-align-center-center']=true;
        return cssClasses;
      }
    },
    watch: {
      active(active) {
        const directionClass = 'md-has-toast-' + this.directionClass;
        const toastClass = 'md-has-toast';

        if (active) {
          document.body.classList.add(directionClass);
          document.body.classList.add(toastClass);
        } else {
          document.body.classList.remove(directionClass);
          document.body.classList.remove(toastClass);
        }
      },
      toastList(toastList){
        if(toastList.length==0){
          this.active=false;
        }
      }
    },
    methods: {
      toast: function (toastInfo) {
        const toast={id: this._.uniqueId()};
        toast.text=toastInfo;

        this.initToast(toast);
        this.toastList.push(toast);

        this.active=true;
      },
      initToast(toast){
        if(!this.active){
          this.open();
        }
        toast.duration=toast.duration||this.mdDuration;
        toast.timeoutStartedAt = Date.now();
        toast.pendingDuration = toast.duration;
        toast.closeTimeout =this._.delay(this.closeItem, toast.duration,toast);
      },
      closeItem(toast){
        window.clearTimeout(toast.closeTimeout);
        toast.pendingDuration = toast.duration;
        this.toastList.splice(this.toastList.indexOf(toast), 1);
      },
      pauseTimeout(toast) {
        toast.pendingDuration = toast.pendingDuration - (Date.now() - toast.timeoutStartedAt);
        toast.timeoutStartedAt = 0;
        window.clearTimeout(toast.closeTimeout);
      },
      resumeTimeout(toast) {
        toast.timeoutStartedAt = Date.now();
        toast.closeTimeout =this._.delay(this.closeItem, toast.pendingDuration,toast);
      },
      removeElement() {
        if (document.body.contains(this.snackbarElement)) {
          document.body.removeChild(this.snackbarElement);
        }
      },
      open() {
        this.active = true;
        document.body.appendChild(this.snackbarElement);
      },
      close() {
        this.active = false;
      },
    },
    mounted() {
      this.snackbarElement = this.$el;
      this.snackbarElement.parentNode.removeChild(this.snackbarElement);
    },
    beforeDestroy() {
      this.removeElement();
    }
  };
</script>