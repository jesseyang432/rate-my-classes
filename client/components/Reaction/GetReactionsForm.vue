<!-- Form for getting Reactions (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetReactionsForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.filter};
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/reactions?author=${this.value}` : '/api/reactions';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateFilter', this.value);
        this.$store.commit('updateReactions', res);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' Reactions
          this.$store.commit('refreshReactions');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
