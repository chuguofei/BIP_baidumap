import pick from 'lodash/pick';
import extend from 'lodash/extend';
export default class Column {
  constructor(columnComponent) {
    const
      options = {
        width: '150px'
      },
      mixins = extend({}, options, columnComponent);
    const properties = pick(mixins, [
      'field', 'label', 'dataType', 'sortable', 'sortBy', 'filterable', 'editable',
      'filterOn', 'hidden', 'formatter', 'cellClass', 'headerClass',
      'width', 'isTool', 'refType', 'refId', 'refInit','multiple'
    ]);

    for (const property in properties) {
      this[property] = mixins[property];
    }
    if (mixins.$scopedSlots && mixins.$scopedSlots.default) {
      this.template = mixins.$scopedSlots.default;
    }
    if (mixins.$scopedSlots && mixins.$scopedSlots.editor) {
      this.templateEditor = mixins.$scopedSlots.editor;
    }
  }

  isFilterable() {
    return this.filterable;
  }

  getFilterFieldName() {
    return this.filterOn || this.field;
  }

  isSortable() {
    return this.sortable;
  }

  getSortPredicate(sortOrder, allColumns) {
    const sortFieldName = this.getSortFieldName();

    const sortColumn = allColumns.find(column => column.field === sortFieldName);

    const dataType = sortColumn.dataType;

    if (dataType.startsWith('date') || dataType === 'numeric') {

      return (row1, row2) => {
        const value1 = row1.getSortableValue(sortFieldName);
        const value2 = row2.getSortableValue(sortFieldName);

        if (sortOrder === 'desc') {
          return value2 < value1 ? -1 : 1;
        }

        return value1 < value2 ? -1 : 1;
      };
    }

    return (row1, row2) => {
      const value1 = row1.getSortableValue(sortFieldName);
      const value2 = row2.getSortableValue(sortFieldName);
      if (sortOrder === 'desc') {
        return value2.localeCompare(value1);
      }
      return value1.localeCompare(value2);
    };
  }

  getSortFieldName() {
    return this.sortBy || this.field;
  }
}