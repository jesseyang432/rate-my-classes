<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'password', label: 'Password', value: ''},
        {id: 'classYear', label: 'Class Year', value: ''},
        {id: 'major', label: 'Major', value: ''},
      ],
      title: 'Create account',
      buttonText: 'Create account',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Reactions'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
      asyncCallback: async () => {
        const similarity_options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin' // Sends express-session credentials with request
          };

          const similarity_r = await fetch('/api/similarities', similarity_options);
          if (!similarity_r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await similarity_r.json();
            throw new Error(res.error);
          }

          this.$store.commit('refreshSimilarities');
      },
    };
  }
};
</script>
