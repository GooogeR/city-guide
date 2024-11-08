<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-row>
      <!-- Отображение объектов, которые добавлены через ЛК -->
      <v-col v-for="place in places" :key="place._id" cols="12" md="4">
        <v-card>
          <!-- Используем полный URL для изображения -->
          <v-img :src="'http://localhost:3001' + place.image || 'https://via.placeholder.com/300'" height="200px" />
          <v-card-title>{{ place.name }}</v-card-title>
          <v-card-subtitle>{{ place.category || 'Без категории' }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" :to="'/city/' + place._id">
              Подробнее
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      places: [], // Сюда будут загружаться объекты с сервера
      error: ''
    }
  },
  created () {
    this.fetchPlaces() // Загружаем объекты при создании компонента
  },
  methods: {
    async fetchPlaces () {
      try {
        let token = localStorage.getItem('token') // Получаем токен из локального хранилища
        if (!token) {
          token = await this.refreshTokens() // Если нет токена, пробуем его обновить
        }

        // Запрос на сервер для получения списка объектов
        const response = await fetch('http://localhost:3001/api/places', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error('Ошибка при загрузке объектов')
        }

        const data = await response.json()
        this.places = data.places // Сохраняем полученные объекты
      } catch (error) {
        this.error = error.message
        console.error(error)
      }
    },

    async refreshTokens () {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        this.logout()
        return
      }

      try {
        const response = await fetch('http://localhost:3001/api/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        })

        if (!response.ok) {
          throw new Error('Не удалось обновить токены')
        }

        const data = await response.json()
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)

        return data.accessToken
      } catch (error) {
        console.error('Ошибка обновления токенов:', error)
        this.logout()
      }
    },

    logout () {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      this.$router.push('/login') // Перенаправление на страницу входа
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
