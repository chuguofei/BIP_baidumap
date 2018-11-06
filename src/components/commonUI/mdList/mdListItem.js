import MdListItemButton from './mdListItemButton';
import MdListItemLink from './mdListItemLink';
import MdListItemRouter from './mdListItemRouter';
import mdListItemExpand from './mdListItemExpand';
import MdListItemDefault from './mdListItemDefault';

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }; }

export default {
    functional: true,
    props: {
        href: String,
        disabled: Boolean
    },
    render(createElement, _ref) {
        var children = _ref.children,
            data = _ref.data,
            props = _ref.props;

        function getItemComponent() {
            const nativeOn = data.nativeOn;
            const interactionEvents = [
                'contextmenu',
                'dblclick',
                'dragend',
                'mousedown',
                'touchstart',
                'click'
            ];
            let childrenCount = children.length;

            if (props.href) {
                return MdListItemLink;
            }

            if (nativeOn) {
                let counter = interactionEvents.length;

                while (counter--) {
                    if (nativeOn[interactionEvents[counter]]) {
                        return MdListItemButton;
                    }
                }
            }

            while (childrenCount--) {
                const options = children[childrenCount].componentOptions;

                if (options) {
                    if (options.tag === 'md-list-expand') {
                        const expandComponent = children[childrenCount];

                        data.scopedSlots = {
                            expand: () => expandComponent
                        };

                        children.splice(childrenCount, 1);

                        return mdListItemExpand;
                    } else if (options.tag === 'router-link') {
                        children[childrenCount].data.staticClass = 'md-list-item-container md-button';

                        return MdListItemRouter;
                    }
                }
            }
            return MdListItemDefault;
        };

        return createElement(getItemComponent(), data, children);
    }
};
