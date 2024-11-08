<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Регистрация</h2>
    <form @submit.prevent="register">
      <input v-model="name" type="text" placeholder="Имя" required>
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Пароль" required>
      <button type="submit">
        Зарегистрироваться
      </button>
    </form>
    <p v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async register () {
      try {
        const response = await fetch('http://localhost:3001/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name, email: this.email, password: this.password })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Ошибка регистрации')
        }

        const data = await response.json()
        console.log('Регистрация успешна:', data)
        this.$router.push('/login')
      } catch (error) {
        this.error = error.message
      }
    }
  }
}
</script>
