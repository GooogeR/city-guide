<template>
  <v-btn color="primary" @click="login">
    Войти
  </v-btn>
</template>

<script>
export default {
  methods: {
    login () {
      // Здесь должна быть логика для авторизации пользователя.
      // Например, редирект на страницу авторизации
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Здесь можно добавить стили для кнопки */
</style>
