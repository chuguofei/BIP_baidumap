<template>
  <div class="md-table-action layout-row layout-align-start-center">
      <md-button class="md-icon-button" @click.native="onAdd()" v-if="mdAdd">
        <md-icon>add</md-icon>
        <md-tooltip>新增行</md-tooltip>
      </md-button>
      <md-button class="md-icon-button" @click.native="onInsert()" v-if="mdInsert">
        <md-icon>playlist_play</md-icon>
        <md-tooltip>插入行</md-tooltip>
      </md-button>
      <md-button class="md-icon-button" @click.native="onRemove()" v-if="mdRemove">
        <md-icon>clear</md-icon>
        <md-tooltip>删除行</md-tooltip>
      </md-button>
      <md-button class="md-icon-button" @click.native="onReload()" v-if="mdReload">
        <md-icon>autorenew</md-icon>
        <md-tooltip>重新加载</md-tooltip>
      </md-button>
  </div>
</template>

<script>
  export default {
    props: {
      mdAdd: {
        type: Boolean,
        default: true
      },
      mdInsert: {
        type: Boolean,
        default: true
      },
      mdRemove: {
        type:Boolean,
        default: true
      },
      mdReload: {
        type: Boolean,
        default: true
      },
    },
    computed: {
      hasTool() {
        return this.mdAdd ||this.mdInsert || this.mdRemove||this.mdReload;
      }
    },
    methods: {
      onAdd() {
        this.$emit('onAdd');
      },
      onInsert() {
        this.$emit('onInsert');
      },
      onRemove() {
        this.$emit('onRemove');
      },
      onReload() {
        this.$emit('onReload');
      },
    },
    mounted() {
    }
  };
</script>
