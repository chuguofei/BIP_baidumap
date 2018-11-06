// import ReportUI from './report';
import Common from './common';
import Mobile from './mobile';
import Applet from './applet';
// import Bill from './bill';
import Chart from './charts';
import Excel from './excel';
import Cwork from './cwork';
import BI from './bi'
import taskApp from './taskApp'
import msgDia from './mdBipMsgDialog'
import MapECharts from './mapecharts'
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }

  install.installed = true;
  Vue.use(Common);
  Vue.use(Mobile);
  // Vue.use(ReportUI);
  Vue.use(Cwork);
  Vue.use(Applet);
  Vue.prototype.$msgDialog = msgDia;
  Vue.use(taskApp);
  Vue.use(Chart);
  Vue.use(Excel);
  Vue.use(BI);
  Vue.use(MapECharts);
}
