export default {
  props: {
    value: [String, Number,Object,Array],
    disabled: Boolean,
    required: Boolean,
    maxlength: [Number, String],
    placeholder: String,
    mdContainer:{
      type: String,
      default: 'parent'
    },
    fetch: {
      type: Function
    },
    debounce: {
      type: Number,
      default: 1E2
    },
  },
  data() {
    return {
      timeout: 0,
      loading:false
    };
  },
  watch: {
    value(value) {
      this.setParentValue(value);
      this.updateValues(value);
    },
    disabled() {
      this.setParentDisabled();
    },
    required() {
      this.setParentRequired();
    },
    placeholder() {
      this.setParentPlaceholder();
    },
    maxlength() {
      this.handleMaxLength();
    }
  },
  methods: {
    handleMaxLength() {
      if(this.mdContainer&&this.parentContainer){
        this.parentContainer.enableCounter = this.maxlength > 0;
        this.parentContainer.counterLength = this.maxlength;
      }
    },
    setParentValue(value) {
      if(this.mdContainer&&this.parentContainer){
        var elValue=this.getElementValue();
        // console.log(elValue,value);
        this.parentContainer.setValue(value || elValue);
      }
    },
    setParentDisabled() {
      if(this.mdContainer&&this.parentContainer){
        this.parentContainer.isDisabled = this.disabled;
      }
    },
    setParentRequired() {
      if(this.mdContainer&&this.parentContainer){
        this.parentContainer.isRequired = this.required;
      }
    },
    setParentPlaceholder() {
      if(this.parentContainer){
        this.parentContainer.hasPlaceholder = !!this.placeholder;
      }
    },
    updateValues(value) {
      var elValue=this.getElementValue();
      const newValue = value || elValue || this.value;
      this.setParentValue(newValue);
      if(this.mdContainer&&this.parentContainer){
        this.parentContainer.inputLength = newValue ? newValue.length : 0;
      }
    },
    onFocus() {
      if (this.parentContainer) {
        this.parentContainer.isFocused = true;
      }
      var elValue=this.getElementValue();
      this.$emit('focus');
    },
    onBlur() {
      if(this.parentContainer){
        this.parentContainer.isFocused = false;
      }
      this.setParentValue();
      var elValue=this.getElementValue();
      this.$emit('blur');
    },
    debounceUpdate() {
      if(!this.fetch||typeof this.fetch!=='function'){
        return;
      }
      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }
      this.timeout = window.setTimeout(() => {
        this.loading = true;
        const queryObject = this.getElementValue();
        return this.makeFetchRequest(queryObject);
      }, this.debounce);
    },
    makeFetchRequest(queryObject) {
      this.fetch(queryObject);
      this.loading = false;
    },
    getElementValue(){
      return this.$refs.input?this.$refs.input.value:this.$el.value;
    },
    onInput() {
      var elValue=this.getElementValue();
      this.updateValues();
      this.$emit('change', elValue);
      this.$emit('input', elValue);
      this.debounceUpdate();
    }
  }
};
