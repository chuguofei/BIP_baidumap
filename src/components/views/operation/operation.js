// 业务定义
import _ from 'lodash';
export default class Operation {
  constructor(operationOptions){
    const defaultOps = {'pkfld':'sid','buidfld':'sbuid','reffld':'creftimes','lkbuidfld':'slkbuid','lknofld':'slkid',
      'statefld':'state','iymfld':'iym','hpdatefld':'hpdate','sorgfld':'sorg','smakefld':'smake'
    };
    const mixins = _.extend({}, defaultOps, operationOptions);
    const properties = _.pick(mixins, [
      'buid', 'pname', 'bmain', 'bnew', 'pmenuid', 'maintb', 'pkfld',
      'buidfld', 'reffld', 'bulnk', 'lkbuidfld', 'lknofld',
      'statefld', 'iymfld', 'hpdatefld', 'sorgfld', 'smakefld','qid','purl','docfld','docfmt','us_mkvou',
      'us_delvou','us_gmts','us_gmerr','sublnk','procs'
    ]);

    for (const property in properties) {
      this[property] = mixins[property];
    }
  }

}
