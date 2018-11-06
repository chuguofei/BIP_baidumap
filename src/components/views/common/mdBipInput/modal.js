// const PRIMARY = 1;
// const NOTEDIT = 0x40;
// const READONLY  = 0x20;
// const INPUT_COMMON = 0;// 普通输入框
// const INPUT_LIST = 1;// 下拉框
// const INPUT_CHECK = 3;//多选
// const INPUT_RADIO = 4;//单选
// const INPUT_YESNO = 5;//是否
// const INPUT_IMAGE = 6;//图片
// const INPUT_FILE = 7;//文件
// const INPUT_REF = 8;//参照
// const INPUT_DATE = 9;//日期
export default {
  data () {
    return {
      PRIMARY:0,
      NOTEDIT: 0x40,
      READONLY: 0x20,
      INPUT_COMMON: 0,
      INPUT_LIST: 1,
      INPUT_CHECK: 3,
      INPUT_RADIO: 4,
      INPUT_YESNO: 5,
      INPUT_IMAGE: 6,
      INPUT_FILE: 7,
      INPUT_REF: 8,
      INPUT_DATE: 9,
      disabled: false,
      oldValue:""
    }
  },
  props: {cell:Object,isSearch: {type:Boolean,default:false},modal:{},btj:{default:false,type:Boolean}},
  mounted () {
    this.oldValue = '';
    if(this.cell) {
      let notedit = this.cell.attr&this.NOTEDIT;
      this.disabled = notedit > 0 ? true:false;
      if(this.modal&&this.modal[this.cell.id]){
        this.oldValue = this.modal[this.cell.id];
      }
    }

  },
  methods: {
    parentChange(){
      // console.log('111');
    }
  }    
}