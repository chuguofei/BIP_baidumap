export default {
  functional: true,
  props: ['column', 'row'],
  render(createElement, context) {
    const data = context.data||{};
    const props = context.props;
    const type = 'div';
    data.class = data.class || [];
    data.domProps = data.domProps || {};

    if (props.column && props.column.templateEditor) {
      return createElement(type, data, props.column.templateEditor(props.row.data));
    }
    if (context.children && context.children.length) {
      return createElement(type, data, context.children);
    }
    return createElement(type, data);
  }
}