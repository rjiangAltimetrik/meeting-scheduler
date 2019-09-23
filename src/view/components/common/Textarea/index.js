
import InputField from '../InputField';
import { isRequired } from '../../../utils/form_validator';

export default {
  name: 'Textarea',
  components: {
    InputField,
  },
  computed: {
    rules() {
      const { required } = this;
      const rules = [];
      if (required) {
        rules.push(isRequired);
      }
      return rules;
    },
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // Props for input validation, check rules() above for details
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {},
};
