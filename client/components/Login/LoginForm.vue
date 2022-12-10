<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'password', label: 'Password', value: ''},
      ],
      buttonText: 'Sign in',
      title: 'Sign in',
      callback: () => {
        this.$router.push({name: 'Reactions'});
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
        this.$store.commit('refreshSimilarities');
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
