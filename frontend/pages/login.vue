<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Авторизация</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Пароль" required>
      <button type="submit">
        Войти
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
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login () {
      try {
        const response = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        })

        if (!response.ok) {
          throw new Error('Неверные учетные данные')
        }

        const data = await response.json()
        // Сохранение токена
        localStorage.setItem('token', data.token)

        // Редирект на профиль после успешного логина
        this.$router.push('/profile')
      } catch (error) {
        this.error = error.message
      }
    }
  }
}
</script>
