import common from '../core/utils/common.js';
export default {
  filters: {
    formartObj: function(values,cell){
      if (cell.type === 3) {
        let pit = cell.ccPoint>0 ? cell.ccPoint:2;
        let num = parseFloat( values === '' ? 0 : values)
        if (num === 0) {
          return 0;
        } else {
          return common.formatDecimal(values,{precision: pit});
        } 
      }
      return values;
    }
  },
  methods:{
    setRowColor(_index){
      _index = _index % 2;
      if ( _index !== 0){
        return true;
      }
      return false;
    },
    numRed (vals,cell) {
      if(cell.type === 3 &&vals<0)
        return true;
      return false;
    }
  }
}