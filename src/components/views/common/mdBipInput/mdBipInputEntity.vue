<template>
  <div class="md-input-ref layout layout-row" @click.native="applyInputFocus">
      <md-input-value
        v-for="(chip ,columnIndex) in selectedValues"
        :md-deletable="!disabled"
        :disabled="disabled"
        :key="columnIndex"
        @delete="deleteChip(chip)">
        <slot :value="chip"><span>{{ chip[cols[0]] }}</span></slot>
      </md-input-value>
      <md-input
        v-show="canEdit"
        v-model="currentInputValue"
        type="text"
        :placeholder="placeholder"
        :id="inputId"
        :name="name"
        :disabled="disabled"
        :required="required"
        @keydown.native.delete="deleteLastChip"
        @keydown.native.prevent.enter="addInputChip"
        @keydown.native.prevent.186="addInputChip"
        @dblclick.native="openRef()"
        tabindex="0"
        md-container=""
        ref="input">
      </md-input>
      <md-button class="md-icon-button md-ref-filter" @click.native="openRef()">
        <md-icon>search</md-icon>
      </md-button>
      <md-bip-dia ref="ref" :options="refOptions" :multiple="!!multiple" :md-ref-id="mdRefId" @open="onRefOpen" @close="onRefClose"></md-bip-dia>
  </div>
</template>

<script>
import getClosestVueParent from "../../../core/utils/getClosestVueParent";
import common from "../../../core/utils/common";
import commonInput from "../../../commonUI/mdInputContainer/common";
export default {
  props: {
    id: String,
    name: String,
    multiple: {
      type: Boolean,
      default: false
    },
    mdRefId: String,
    mdKeyField: String,
    mdNameField: String,
    maxlength: {
      type: [Number, String],
      default: 1
    }
  },
  mixins: [commonInput],
  data() {
    return {
      currentInputValue: null,
      selectedValues: [],
      inputId: this.id || "refs-" + common.uniqueId(),
      refInfo: {},
      refData: [],
      loading: 0,
      canEdit: true,
      refIsOpened: false,
      refOptions: { wheres: {}, orders: {} },
      cols: []
    };
  },
  watch: {
    value(value) {
      this.setValue(value);
    },
    selectedValues(v) {
      if (this.multiple) {
        this.canEdit =
          this.maxlength > 1
            ? this.selectedValues.length < this.maxlength
            : true;
      } else {
        this.canEdit = this.selectedValues.length < 1;
      }
      this.setParentValue(v);
    }
  },
  methods: {
    setValue(value) {
      // console.log("select values", this.selectedValues);
      this.setParentValue(value);
    },
    openRef() {
      this.refIsOpened = true;
      this.$emit("init", this.refOptions);
      this.$refs["ref"].open();
    },
    onRefOpen(type) {},
    onRefClose(resdata) {
      if (resdata) {
        this.refInfo = resdata;
      }else if(this.value){
        var parentRefs = this.$parent.$parent.column.refValues;
        this.refInfo.cols = parentRefs.cols;
        this.refInfo.value = [];
        var vv = this.value.split(';')||this.value.split(',');
        _.forEach(vv,v =>{
          _.forEach(parentRefs.values,item=>{
            if(item[this.refInfo.cols[0]]==v){
              this.refInfo.value.push(item);
            }
          });
        });
      }
      var data = this.refInfo.value;
      this.cols = this.refInfo.cols;
      this.refIsOpened = false;
      if (!data || data.length == 0) return;
      if (this.$parent.$parent.column.refValues == undefined) {
        this.$parent.$parent.column.refValues = {};
        this.$parent.$parent.column.refValues.cols = this.refInfo.cols;
        this.$parent.$parent.column.refValues.multiple = this.refInfo.multiple;
        this.$parent.$parent.column.refValues.values = [];
      }
      if (!this.multiple) this.selectedValues = [];
      data &&
        data.forEach((row, index) => {
          this.addValue(row);
        });
    },
    applyInputFocus() {
      this.$nextTick(() => {
        this.$refs.input.$el.focus();
      });
    },
    addValue(value) {
      if (!value || !value[this.cols[0]]) {
        return;
      }
      if (
        this.multiple &&
        this.maxlength > 1 &&
        this.selectedValues.length >= this.maxlength
      ) {
        return;
      }
      if (!this.multiple && this.selectedValues.length > 1) {
        return;
      }
      const index = this.getValueIndex(value);
      if (index < 0) {
        this.selectedValues.push(value);
        const _ii = this.getColumnValueIndex(value);
        if (_ii < 0) {
          this.$parent.$parent.column.refValues.cols = this.cols;
          if(!this.$parent.$parent.column.refValues.values){
            this.$parent.$parent.column.refValues.values = [];
          }
          this.$parent.$parent.column.refValues.values.push(value);
        }
        const nv = this.formatValue();
        this.$emit("input", nv);
        this.$emit("change", nv);
        this.applyInputFocus();
      }
    },
    addInputChip() {
      if (this.currentInputValue) {
        const value = { name: this.currentInputValue.trim() };
        value.id = value.name;
        this.currentInputValue = null;
        this.addValue(value);
      }
    },
    deleteChip(chip) {
      const index = this.getValueIndex(chip);
      if (index >= 0) {
        this.selectedValues.splice(index, 1);
        const nv = this.formatValue();
        this.$emit("input", nv);
        this.$emit("change", nv);
        this.applyInputFocus();
      }
    },
    getValueIndex(value) {
      for (var i = 0; i < this.selectedValues.length; i++) {
        if (
          value[this.cols[0]] &&
          this.selectedValues[i][this.cols[0]] == value[this.cols[0]]
        ) {
          return i;
        }
      }
      return -1;
    },
    getColumnValueIndex(value) {
      var values = this.$parent.$parent.column.refValues.values;
      if (values) {
        for (var i = 0; i < values.length; i++) {
          if (
            value[this.cols[0]] &&
            values[i][this.cols[0]] == value[this.cols[0]]
          ) {
            return i;
          }
          // if (
          //   value[this.cols[1]] &&
          //   values[i][this.cols[1]] == value[this.cols[1]]
          // ) {
          //   return i;
          // }
        }
      }
      return -1;
    },
    deleteLastChip() {
      if (!this.currentInputValue) {
        if (this.selectedValues.length) {
          this.selectedValues.pop();
          const nv = this.formatValue();
          this.$emit("input", nv);
          this.$emit("change", nv);
          this.applyInputFocus();
        }
      }
    },
    formatValue() {
      if (!this.multiple) {
        if (this.selectedValues.length) {
          this.currentInputValue = this.selectedValues[0][this.cols[0]];
          return this.selectedValues[0][this.cols[0]];
        } else {
          return "";
        }
      }
      return this.selectedValues;
    },
    // getCallBack(res) {
    //   console.log(res);
    // },
    // getCallError(res) {}
  },
  mounted() {
    this.$nextTick(() => {
      this.parentContainer = getClosestVueParent(
        this.$parent,
        "md-input-container"
      );
      this.updateValues(this.formatValue());
      this.setParentDisabled();
      this.setParentRequired();
    });
    this.$refs["ref"].cancel();
  }
};
</script>
