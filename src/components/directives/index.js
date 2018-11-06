
import wave from './wave';
import colors from './colors';

const options = {
    wave,
    colors,
};

export default function install(Vue) {
    if (install.installed) {
        console.warn('Vue directives is already installed.');
        return;
    }
    install.installed = true;

    for (let component in options) {
        const componentInstaller = options[component];

        if (componentInstaller && component !== 'install') {
            Vue.use(componentInstaller);
        }
    }
}
