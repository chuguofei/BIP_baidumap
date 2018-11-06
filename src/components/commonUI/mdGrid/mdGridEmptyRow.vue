<template>
  <tr class="md-grid-empty-row">
    <td v-if="multiple" :selection="true" :style="{'overflow':'hidden'}"></td>
    <td v-for="(column,index) in visibleColumns" :style="{'overflow':'hidden','width':column.width}">
    </td>
  </tr>
</template>
<script>
import getClosestVueParent from '../../core/utils/getClosestVueParent';
export default {
  props: ['columns'],

  components: {},
  data() {
    return {
      parentTable: {},
      multiple: false
    }
  },
  computed: {
    visibleColumns() {
      return this.columns && this.columns.filter(column => !column.hidden);
    },
  },
  mounted() {
    this.parentTable = getClosestVueParent(this.$parent, 'md-grid');
    this.multiple = this.parentTable.multiple;
  },
};
</script>