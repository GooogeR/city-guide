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
        location: ''
      },
      places: [], // Список объектов
      error: ''
    }
  },
  created () {
    this.fetchPlaces()
  },
  methods: {
    async fetchPlaces () {
      try {
        const response = await fetch('http://localhost:3001/api/places', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
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
        const response = await fetch('http://localhost:3001/api/places', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.place)
        })

        if (!response.ok) {
          throw new Error('Не удалось добавить объект')
        }

        // Сбрасываем форму после успешного добавления
        this.place = { name: '', description: '', location: '' }
        this.showAddForm = false

        // Обновляем список объектов
        this.fetchPlaces()
      } catch (error) {
        this.error = error.message
      }
    }
  }
}
</script>
