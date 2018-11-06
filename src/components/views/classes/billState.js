const INSERT = 1; //--新增
const EDITED = 2; //值改变
const DELETE = 4; //加删除标志
const EDITSUB = 8; //字表改变
const EDITEDPK = 0x10; //主键改变
const IMPORT =  0x20; //这主要用于导入记录(结合INSERT使用,保存时先做更新,不存在时再做插入)
const REPLACESUB= 0x40; //(替换子表)修改前先删除子表
const HISTORY = 0x80;//历史数据(仅做为显示用)
const COPY = 0x100;//从其它记录拷贝过来
const DICT = 0x200;//记录经过动态字典处理后,置上该标记。
const POSTED =  0x400; ////记录已提交过

const billState = {
  INSERT,
  EDITED,
  DELETE,
  EDITSUB,
  EDITEDPK,
  IMPORT,
  REPLACESUB,
  HISTORY,
  COPY,
  DICT,
  POSTED
}

export default billState;