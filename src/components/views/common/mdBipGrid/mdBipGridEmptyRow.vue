<template>
  <tr class="md-bip-grid-empty-row">
    <td v-if="multiple" :selection="true" :style="{'overflow':'hidden'}"></td>
    <td v-for="(column,index) in visibleColumns" :key="index" :style="{'overflow':'hidden','width':column.width}">
    </td>
  </tr>
</template>
<script>
import getClosestVueParent from '@/components/core/utils/getClosestVueParent';
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
    this.parentTable = getClosestVueParent(this.$parent, 'md-bip-grid');
    this.multiple = this.parentTable.multiple;
  },
};
</script>