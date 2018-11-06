import EchartsGauge from './EchartsGauge';
import EchartsLine from './EchartsLine';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('echarts-gauge', EchartsGauge);
  Vue.component('echarts-line', EchartsLine);
}
