/* Code Components */
import MdTheme from './components/mdTheme';
import MdInkRipple from './components/mdInkRipple';
import CoreTheme from './core.theme';

export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }

  install.installed = true;

  Vue.use(MdTheme);
  Vue.use(MdInkRipple);
  Vue.material.styles.push(CoreTheme);
}
