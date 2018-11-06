import _ from 'lodash';
import BillState from './billState'
import common from '../../core/utils/common.js';
import scriptProc from './BipScriptProc';
import BipScriptProc from './BipScriptProc';
import billState from './billState';
// 整体的数据类型
export default class CDataSet {
  constructor(ccells) {
    this.ccells = ccells;
    this.cdata = [];
    this.removeData = [];
    this.index = -1;
    this.ds_sub = [];
    this.ds_par = null;
    this.pcell = null;
    this.x_pk = this.indexPKID(ccells, true, true)
    this.currRecord = { sys_stated: BillState.DICT };
    this.canEdit = true;
    if (ccells.subLayCells) {
      _.forEach(ccells.subLayCells, (item) => {
        var ds = new CDataSet(item);
        ds.ds_par = this;
        // console.log(ds);
        this.ds_sub.push(ds);
      });
    }
    this.scriptProc = new BipScriptProc(this.currRecord,this.ccells.cels);
  }

  indexPKID(cell, bfull, bcid){
    var cel, cels = cell.cels;
    // console.log(cels,'909090');
    var rx = -1, x0 = 0, cp = cell.pkcc, xco = cell.x_co, t0 = 0, t1, cc = cels.length;
    var atr;
    for (var i = 0, cx = 0;cx < cp && i < cc;i++) {
      cel = cels[i];
      atr = cel.attr;
      if ((atr & 1) != 0) {
        if (cel.index != xco) {
          t1 = cel.type;
          if (bcid && t1 === 5 && ((cel.attr & 0x800000) != 0 || cel.ccName=='cid')){
            return x0;//直接用cid时
          }
          t1 = t1 == 12 ? cel.ccLeng : (t1 == 4 ? 4 : 2);
          if (t1 > t0) {
            t0 = t1;
            rx = x0;
           }
        }
        x0++;
        cx++;
      }else if(bfull || (atr & 512) != 0)
      x0++;
    }
    return rx;
  }

  addRow(crecord) {
    // crecord.sys_stated = BillState.INSERT | BillState.EDITED;
    this.cdata.push(crecord);
    this.index = this.cdata.length - 1;
    this.currRecord = crecord;
    if((crecord.sys_stated&BillState.INSERT)>0||(crecord.sys_stated&BillState.EDITED)>0)
      this.checkGS();
  }

  checkGS(cell) {
    if(cell){
      const attr = cell.attr;
      if ((attr & 0x100000) > 0) {
        // console.log('多列计算')
        this.checkMulCols(cell);
      }
    }
    this.scriptProc.data = this.currRecord;
    _.forEach(this.ccells.cels, col => {
      let scstr = col.script;
      if (scstr && scstr.indexOf('=:') === 0) {
        scstr = scstr.replace('=:', '');
        // 公式计算
        var vl = this.scriptProc.execute(scstr,null,col);
        // console.log(vl,this.currRecord,col.id,scstr);
        this.currRecord[col.id] = vl;
      }
    })
    // console.log(this.row);
  }

  // 多列计算
  checkMulCols(cell) {
    var script = cell.script;
    if (script) {
      script = script.split('&');
      var cols = script[0].split(',');
      var _indexs = script[1].split(',');
      var refValues = cell.refValues;
      var id = this.currRecord[cell.id];
      var refInfo;
      if (refValues) {
        if(_.isArray(refValues.value)){
        }else{
          refInfo = refValues.value;
        }
      }
      if (refInfo) {
        _.forEach(cols, (col, n) => {
          var vv = refInfo[refValues.cols[_indexs[n]]];
          // console.log(vv,col);
          if (vv) {
            var cl = this.getCell(col);
            if (cl.type<12 && cl.type>1) {
              vv = new Number(vv).toFixed(cl.ccPoint);
            }
            this.currRecord[col] = vv;
          }
        });
      }
    }
  }

  // 编辑检查
  checkEdit(res) {
    if(this.canEdit){
      // console.log(res);
      var cell = this.getCell(res.cellId);
      // console.log(cell,'cell')
      cell.refValues = res;
      this.checkGS(cell);
      this.currRecord.sys_stated = this.currRecord.sys_stated | BillState.EDITED;
    }else{
      this.currRecord[res.cellId] = res.oldValue;
      // console.log(this.currRecord);
    }
  }

  clearData() {
    this.cdata = _.take(this.cdata, 0);
  }

  deleteRow(row) {
    if (row === -1) {
      row = this.index;
    }
    var delRow = _.pullAt(this.cdata,row);
    this.cdata = _.without(this.cdata,delRow);
    // console.log(this.cdata);
    if(!(delRow.sys_stated&BillState.INSERT)==0){
      delRow.sys_stated = 4;
      this.removeData.push(delRow);
    }
    if(this.ds_par){
      var cell = this.ccells.cels[this.x_pk];
      if(cell&&cell.type==5){
        for(let i=0;i<this.cdata.length;i++){
          var itemRow = this.cdata[i];
          var itmId = itemRow[cell.id] ;
          var newId = (i+1)+'';
          if(itmId !== newId){
            itemRow[cell.id] = newId;
          }
          itemRow.sys_stated = itemRow.sys_stated|billState.EDITED|billState.INSERT;
          this.cdata[i] = itemRow;
          this.ds_par.currRecord.sys_stated = this.ds_par.currRecord.sys_stated|billState.REPLACESUB;
        }
      }
      this.ds_par.currRecord.sys_stated = this.ds_par.currRecord.sys_stated | billState.EDITED;
    }

    if(row==0){
      if(this.cdata.length==0){
        this.currRecord = undefined;
      }else{
        this.currRecord = this.cdata[row-1];
      }
    }else{
      if(this.cdata.length==0){
        this.currRecord = undefined;
      }else{
        this.currRecord = this.cdata[row-1];
      }
    }
    if(this.ds_par){
      this.ds_par.currRecord[this.ccells.obj_id] = this.cdata;
    }
  }

  deleteRecord(row){
    var rowIndex =  _.findIndex(this.cdata, (chr) => {
      return chr == row;
    });
    // console.log(rowIndex,row,'fdsfdsf');
    this.deleteRow(rowIndex);
    // this.cdata = _.remove(this.cdata,(n) =>{
    //   if(n === row){
    //     if(!((n.sys_stated&BillState.INSERT)>0)){
    //       n.sys_stated = 4;
    //       this.removeData.push(n);
    //     }
    //     return true;
    //   }
    //   return false;
    // });
  }

  setPcell(pcell) {
    this.pcell = pcell;
  }

  haveChild() {
    // console.log('111');
    return this.ds_sub.length > 0 ? true : false;
  }

  makeState(state){
    this.currRecord.sys_stated = state;
    if(this.haveChild()){
      this.makeChildState(state);
    }
  }

  makeChildState(state){
    _.forEach(this.ds_sub,item =>{
      _.forEach(item.cdata,crd=>{
        crd.sys_stated = state;
      });
      if(item.haveChild()){
        item.makeState(state);
      }
    });
  }

  getCell(id){
    return _.find(this.ccells.cels,item=>{
      return id === item.id
    });
  }

  createRecord() {
    var modal = this.initModal(true);
    // console.log(modal);
    modal.sys_stated = modal | BillState.INSERT | BillState.EDITED;
    this.addRow(modal);
    this.currRecord = modal;
    this.canEdit = true;
    return this.currRecord;

  }
  initModal(isNew) {
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var deptInfo = user.deptInfo;
    let xinc = this.ccells.autoInc;
    if (xinc > 0)
      xinc = xinc - 1;
    let cel = this.ccells.cels[xinc];
    var modal = { sys_stated: BillState.DICT };
    // this.$set(modal, 'sys_stated', BillState.DICT);
    if ((xinc >= 0 && !modal[cel.id]) || isNew) {
      modal.sys_stated = (modal.sys_stated | BillState.INSERT);
    }
    modal = this.createDataModal(this.ccells, modal);
    if (((modal.sys_stated & BillState.INSERT) > 0)) {
      modal = this.incCalc(this.ccells, modal);
    }
    return modal;
  }
  createDataModal(cell, modal) {
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var deptInfo = user.deptInfo;
    _.forEach(cell.cels, (item, index) => {
      let iniVl = item.initValue;
      if (iniVl == '[!]') {
        iniVl = deptInfo.deptCode;
      }
      if (iniVl == '[$]') {
        iniVl = user.userCode;
      }
      if (iniVl == '[#]') {
        iniVl = deptInfo.cmcCode;
      }
      if ((iniVl == '[Y-M-D]' || iniVl === '0') && item.type === 91) {
        iniVl = common.now('YYYY-MM-DD');
      }
      if ((iniVl == '[Y-M-D]' || iniVl === '0') && item.type === 93) {
        iniVl = common.now();
      }
      if (iniVl == '[Y-M-D]') {
        iniVl = common.now('YYYY-MM-DD');
      }
      if (iniVl == '[YMD]') {
        iniVl = common.now('YYYYMMDD');
      }
      if (iniVl == '[YM]') {
        iniVl = common.now('YYYYMM');
      }
      if (iniVl == '[Y2M]') {
        iniVl = common.now('YYMM');
      }
      if (iniVl == '[Y-M]') {
        iniVl = common.now('YYYY-MM');
      }
      if (iniVl == '[Y2-M]') {
        iniVl = common.now('YY-MM');
      }
      if (item.type <= 5) {
        if (iniVl == undefined)
          iniVl = '';
        else {
          iniVl = parseInt(iniVl) + '';
        }
      }
      modal[item.id] = iniVl?iniVl:'';
      // this.$set(modal, item.id, iniVl);
    });
    return modal;
  }

  getPKInt(){
    var cell = _.find(this.ccells.cels,item=>{
      return (item.attr&1)>0&&item.type<12;
    });
    return cell;
  }
  incCalc(cell, modal) {
    if (cell) {
      let xinc = cell.autoInc;
      // console.log(xinc,'incCal');
      if (xinc > 0) {
        var cel = cell.cels[xinc - 1];
        var s0 = cel.psAutoInc;
        // console.log(s0);
        if (s0 == null || s0 == undefined || s0.length < 1 || cel.type !== 12)
          return;
        let ilnk = cel.lnk_inn;
        // console.log('ilink',ilnk);
        s0 = this.incCalc2(cell.cels, s0, ilnk, modal);
        if ((cel.attr & 0x10000) == 0) {
          var x0 = s0.lastIndexOf('%');
          s0 = x0 < 1 ? s0 : s0.substring(0, x0 + 1);
        }
        modal[cel.id] = s0;
        // this.$set(modal, cel.id, s0);
      }else{
        var cell = this.getPKInt();
        if(cell)
          modal[cell.id] = (this.cdata.length+1)+'';
      }
    }
    return modal;
  }
  incCalc2(cells, sinc, ilnk, modalV) {
    let x0 = sinc.indexOf('\r'), x1;
    if (x0 > 0)
      sinc = sinc.substring(0, x0);
    var cc = sinc.charAt(0);
    if (cc == '[') {
      sinc = sinc.substring(1, sinc.length - 1);
    }
    // console.log(sinc);
    sinc = this.formatVars(sinc);
    // console.log(sinc);
    // 处理其他关联
    x0 = sinc.indexOf('%');
    if (x0 >= 0) {
      while (x0 >= 0 && ilnk != 0) {
        x1 = (ilnk & 0xFF) - 1;
        if (x1 < 0) {
          console.log(sinc + " autoinc innlink(-1)")
        }
        var refCel = cells[x1];
        var vv = modalV[refCel.id];
        sinc = sinc.substring(0, x0) + this.incCalca(refCel, (ilnk >>> 8) & 0xFF, vv, x1) + sinc.substring(x0 + 1);
        x0 = sinc.indexOf('%', x0);
        ilnk >>>= 16;
      }
    }
    return sinc;
  }
  incCalca(cel, iinc, orf, xdep) {
    var t0 = iinc & 0xF0;
    var s0 = '';
    // console.log(cel,iinc,orf,xdep);
    if (t0 == 16) {
      var bbc = orf.match(global.FULLDATE);
      if (bbc == null)
        orf = common.now();
      if ((iinc & 2) !== 0) {
        s0 += common.getDate(orf, 'YY');
      } else if ((iinc & 1) !== 0) {
        s0 += common.getDate(orf, 'YYYY');
      }
      if ((iinc & 4) !== 0) {
        s0 += common.getDate(orf, 'MM');
      }
      if ((iinc & 8) !== 0) {
        s0 += common.getDate(orf, 'DD');
      }
      return s0;
    }
    if (orf == null)
      return "0";
    s0 = orf + '';
    return s0;
  }
  formatVars(sinc) {
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var deptInfo = user.deptInfo;
    sinc = sinc.replace(/\[!\]/g, deptInfo.deptCode);
    sinc = sinc.replace(/\[#\]/g, deptInfo.cmcCode);
    sinc = sinc.replace(/\[$\]/g, user.userCode);
    sinc = sinc.replace(/\[Y2M\]/g, common.now('YYMM'));
    sinc = sinc.replace(/\[YM\]/g, common.now('YYYYMM'));
    sinc = sinc.replace(/\[YMD\]/g, common.now('YYYYMMDD'));
    return sinc;
  }


}