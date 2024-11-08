<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-template-shadow -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Личный кабинет</h2>

    <!-- Кнопка для добавления нового объекта -->
    <button @click="showAddForm = !showAddForm">
      Добавить объект
    </button>

    <!-- Форма для добавления объекта -->
    <div v-if="showAddForm">
      <form @submit.prevent="addPlace">
        <input v-model="place.name" type="text" placeholder="Название места" required>
        <input v-model="place.description" type="text" placeholder="Описание" required>
        <input v-model="place.location" type="text" placeholder="Местоположение" required>

        <!-- Выбор категории -->
        <select v-model="place.category" required>
          <option disabled value="">
            Выберите категорию
          </option>
          <option value="Ресторан">
            Ресторан
          </option>
          <option value="Парк">
            Парк
          </option>
          <option value="Памятник">
            Памятник
          </option>
        </select>

        <!-- Загрузка изображения -->
        <input type="file" accept="image/*" required @change="handleFileChange">

        <button type="submit">
          Добавить
        </button>
      </form>
    </div>

    <!-- Список объектов на главной странице -->
    <div v-if="places.length > 0">
      <h3>Список объектов</h3>
      <ul>
        <li v-for="(place, index) in places" :key="index">
          <h4>{{ place.name }}</h4>
          <p>{{ place.description }}</p>
          <p>{{ place.location }}</p>
          <p>{{ place.category }}</p>
          <img :src="'http://localhost:3001' + place.image" alt="Изображение объекта" width="100">
        </li>
      </ul>
    </div>

    <p v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showAddForm: false,
      place: {
        name: '',
        description: '',
        location: '',
        category: '',
        image: null
      },
      places: [], // Список объектов
      error: ''
    }
  },
  created () {
    this.fetchPlaces()
  },
  methods: {
    // Обработка изменения изображения
    handleFileChange (event) {
      const file = event.target.files[0]
      if (file) {
        this.place.image = file
      }
    },

    async fetchPlaces () {
      try {
        let token = localStorage.getItem('token')

        // Если токен не найден, пробуем обновить его
        if (!token) {
          token = await this.refreshTokens()
        }

        console.log('Токен для fetchPlaces:', token)

        // Отправка запроса с токеном
        const response = await fetch('http://localhost:3001/api/places', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error('Ошибка при загрузке объектов')
        }

        const data = await response.json()
        this.places = data.places
      } catch (error) {
        this.error = error.message
      }
    },

    async addPlace () {
      try {
        let token = localStorage.getItem('token')

        // Если токен не найден, пробуем обновить его
        if (!token) {
          token = await this.refreshTokens()
        }

        console.log('Токен для addPlace:', token)

        // Создание FormData для отправки файла
        const formData = new FormData()
        formData.append('name', this.place.name)
        formData.append('description', this.place.description)
        formData.append('location', this.place.location)
        formData.append('category', this.place.category)
        formData.append('image', this.place.image)

        // Отправка запроса с токеном
        const response = await fetch('http://localhost:3001/api/places', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error('Не удалось добавить объект')
        }

        this.place = { name: '', description: '', location: '', category: '', image: null }
        this.showAddForm = false
        this.fetchPlaces()
      } catch (error) {
        this.error = error.message
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
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
