import extend from 'lodash/extend';
export default class CeaPars {
  constructor(params) {
    const options={
      sid:'',
      sbuid:'',
      yjcontext:'',
      statefr:'0',
      stateto:'0',
      bup:'1',
      content:'',
      tousr:'',
      ckd:false
    },minxs = extend({}, options, params);
     const properties = ['sid','sbuid','yjcontext','statefr','stateto','bup','content','tousr','ckd'];
     _.forEach(properties,property=>{
      this[property] = minxs[property];
     });
  }
}