import Core from './core'
import Common from './commonUI'
import directives from './directives'
import views from './views'
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }

  install.installed = true;

  Vue.use(Core);
  Vue.use(Common);
  Vue.use(directives);
  Vue.use(views);
}