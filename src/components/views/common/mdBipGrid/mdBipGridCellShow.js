export default {
  functional: true,
  props: ['column', 'row'],

  render(createElement, context) {
    const data = context.data||{};
    const props = context.props;
    const type = 'div';
    data.class = data.class || [];
    data.domProps = data.domProps || {};
    if (props.column && props.column.template) {
      return createElement(type, data, props.column.template(props.row.data));
    }
    if (context.children && context.children.length) {
      return createElement(type, data, context.children);
    }
    if (props.column && props.column.formatter) {
      const v = props.column.formatter(props.row.getValue(props.column.field), props.row.data,props.column);
      return createElement(type, data, v);
    } else {
      const v = (props.row && props.row.getValue(props.column.field)) || '';
      return createElement(type, data, v);
    }
    return createElement(type, data);
  }
};