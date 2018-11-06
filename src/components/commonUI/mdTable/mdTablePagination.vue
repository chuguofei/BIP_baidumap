<template>
  <div class="md-table-pagination">
    <span class="md-table-pagination-label">{{ mdLabel }}:</span>

    <md-select v-model="currentSize" md-container="" md-menu-class="md-pagination-select" @change="changeSize" v-if="mdPageOptions">
      <md-option v-for="amount in mdPageOptions" :key="amount" :value="amount">{{ amount }}</md-option>
    </md-select>

    <span class="md-table-pagination-info">{{pageInfo}}</span>

    <md-button class="md-icon-button md-table-pagination-first" @click.native="firstPage" :disabled="currentPage === 1">
      <md-icon>first_page</md-icon>
    </md-button>
    <md-button class="md-icon-button md-table-pagination-previous" @click.native="previousPage" :disabled="currentPage === 1">
      <md-icon>keyboard_arrow_left</md-icon>
    </md-button>

    <md-button class="md-icon-button md-table-pagination-next" @click.native="nextPage" :disabled="shouldDisable">
      <md-icon>keyboard_arrow_right</md-icon>
    </md-button>

    <md-button class="md-icon-button md-table-pagination-last" @click.native="lastsPage" :disabled="shouldDisable">
      <md-icon>last_page</md-icon>
    </md-button>
  </div>
</template>

<script>
  export default {
    props: {
      mdSize: {
        type: [Number, String],
        default: 10
      },
      mdPageOptions: [Array, Boolean],
      mdPage: {
        type: [Number, String],
        default: 1
      },
      mdTotal: {
        type: [Number, String],
        default: 'Many'
      },
      mdLabel: {
        type: String,
        default: '每页'
      },
      mdSeparator: {
        type: String,
        default: '/'
      }
    },
    data() {
      return {
        subTotal: 0,
        totalItems: 0,
        currentPage: 1,
        currentSize: 0
      };
    },
    watch: {
      'mdTotal': function (val) {
        this.totalItems = isNaN(val) ? Number.MAX_SAFE_INTEGER : parseInt(val, 10);
      },
      'mdSize': function(val) {
        this.currentSize = parseInt(val, 10);
      },
      'mdPage': function (val) {
        this.currentPage = parseInt(val, 10);
      }
    },
    computed: {
      lastPage() {
        return false;
      },
      shouldDisable() {
        return this.currentSize * this.currentPage >= this.totalItems;
      },
      pageInfo(){
        if(!this.mdTotal){
          return '0'+this.mdSeparator+this.mdTotal;
        }
        var sub = this.currentPage * this.currentSize;
        sub = sub > this.mdTotal ? this.mdTotal : sub;
        return (((this.currentPage - 1) * this.currentSize) + 1) +'-'+ sub +this.mdSeparator+this.mdTotal;
      }
    },
    methods: {
      emitPaginationEvent() {
        if (this.canFireEvents) {
          this.$emit('pagination', {
            size: this.currentSize,
            page: this.currentPage
          });
        }
      },
      changeSize() {
        if (this.canFireEvents) {
          this.$emit('size', this.currentSize);
          this.emitPaginationEvent();
        }
      },
      firstPage(){
        if (this.canFireEvents) {
          this.currentPage = 1;
          this.$emit('page', this.currentPage);
          this.emitPaginationEvent();
        }
      },
      previousPage() {
        if (this.canFireEvents) {
          this.currentPage--;
          this.$emit('page', this.currentPage);
          this.emitPaginationEvent();
        }
      },
      nextPage() {
        if (this.canFireEvents) {
          this.currentPage++;
          this.$emit('page', this.currentPage);
          this.emitPaginationEvent();
        }
      },
      lastsPage(){
        if (this.canFireEvents) {
          var bb = this.totalItems%this.currentSize;
          bb = (bb>0?1:0);
          this.currentPage = parseInt(this.totalItems/this.currentSize)+bb;
          // this.currentPage = 1;
          // console.log(this.currentPage)
          this.$emit('page', this.currentPage);
          this.emitPaginationEvent();
        }
      },
    },
    mounted() {
      this.mdPageOptions = this.mdPageOptions || [5,10, 25, 50];
      if (this.mdSize > 0){
        this.currentSize = this.mdSize;
      }else{
        this.currentSize =this.currentSize|| this.mdPageOptions[0];
      }
      this.$nextTick(() => {
        this.canFireEvents = true;
      });
    }
  };
</script>
