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
    <p v-if="success">
      {{ success }}
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
      error: '',
      success: ''
    }
  },
  methods: {
    async register () {
      try {
        const response = await fetch('http://localhost:3001/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password
          })
        })

        if (!response.ok) {
          throw new Error('Ошибка при регистрации')
        }

        this.success = 'Регистрация прошла успешно!'
      } catch (error) {
        this.error = error.message
      }
    }
  }
}
</script>
