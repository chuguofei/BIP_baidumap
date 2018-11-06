<script>
  import common from '../../core/utils/common';

  export default {
    render: function(createElement) {
        var tag=common.snakeCase(this.name);
        return createElement(tag);
    },
    props: {
        name: {
            type: String,
            required: true
        }
    }
};
</script>