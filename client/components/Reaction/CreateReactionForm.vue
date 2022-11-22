<!-- Form for creating reactions (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateReactionForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/reactions',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create a Reaction',
      refreshReactions: true,
      callback: () => {
        const message = 'Successfully created a reaction!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
