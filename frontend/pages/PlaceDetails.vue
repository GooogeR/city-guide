<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-img :src="place.image || 'https://via.placeholder.com/300'" height="300px" />
          <v-card-title>{{ place.name }}</v-card-title>
          <v-card-subtitle>{{ place.category || 'Без категории' }}</v-card-subtitle>
          <v-card-text>
            <p>{{ place.description }}</p>
            <p>{{ place.location }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      place: {},
      error: ''
    }
  },
  created () {
    this.fetchPlaceDetails()
  },
  methods: {
    async fetchPlaceDetails () {
      try {
        const id = this.$route.params.id // Получаем id из параметров маршрута
        const token = localStorage.getItem('token') // Получаем токен из локального хранилища

        const response = await fetch(`http://localhost:3001/api/places/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные')
        }

        const data = await response.json()
        this.place = data // Данные о месте
      } catch (error) {
        this.error = error.message
        console.error(error)
      }
    }
  }
}
</script>
