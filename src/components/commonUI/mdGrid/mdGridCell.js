export default {
  functional: true,

  props: ['column', 'row', 'type', 'colIndex', 'rowIndex'],

  render(createElement, context) {
    const type = context.props.type || 'td';
    const data = context.data;
    data.class = data.class || [];
    data.domProps = data.domProps || {};
    data.on = data.on || {};
    if (context.props.column && context.props.column.isTool) {
      data.class.push('is-tool');
    }
    if (context.props.column && context.props.column.cellClass) {
      data.class.push(context.props.column.cellClass);
    }
    if (context.props.column && context.props.column.template) {
      return createElement(type, data, [createElement('div', { class: ["md-grid-cell-container"] }, context.props.column.template(context.props.row.data))]);
    }
    if (context.children && context.children.length && context.slots) {
      return createElement(type, data, [createElement('div', { class: ["md-grid-cell-container"] }, context.children)]);
    }
    if (context.props.column && context.props.column.formatter) {
      const v = context.props.column.formatter(context.props.row.getValue(context.props.column.field), context.props.row.data);
      return createElement(type, data, [createElement('div', { class: ["md-grid-cell-container"] }, v)]);
    } else {
      const v = context.props.row.getValue(context.props.column.field);
      return createElement(type, data, [createElement('div', { class: ["md-grid-cell-container"] }, v)]);
    }
  },
};