<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-text-field v-model="searchQuery" label="Поиск по названию" />
    <v-select
      v-model="selectedCategory"
      label="Категория"
      :items="categories"
      item-text="name"
      item-value="id"
    />
    <v-btn color="primary" @click="searchPlaces">
      Искать
    </v-btn>

    <v-row>
      <v-col v-for="place in filteredPlaces" :key="place.id" cols="12" md="4">
        <v-card>
          <v-img :src="place.image" height="200px" />
          <v-card-title>{{ place.name }}</v-card-title>
          <v-card-subtitle>{{ place.category }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" :to="'/city/' + place.id">
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
      searchQuery: '',
      selectedCategory: null,
      categories: [
        { id: 1, name: 'Парки' },
        { id: 2, name: 'Музеи' },
        { id: 3, name: 'Спортивные объекты' },
        { id: 4, name: 'Культура и искусство' }
      ],
      places: [
        { id: 1, name: 'Парк им. 30-летия Победы', category: 'Парки', image: 'https://via.placeholder.com/300' },
        { id: 2, name: 'Краснодарский стадион "Кубань"', category: 'Спортивные объекты', image: 'https://via.placeholder.com/300' },
        { id: 3, name: 'Краснодарский театр драмы', category: 'Культура и искусство', image: 'https://via.placeholder.com/300' }
      ]
    }
  },
  computed: {
    filteredPlaces () {
      return this.places.filter((place) => {
        return (
          (this.searchQuery === '' || place.name.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
          (this.selectedCategory === null || place.category === this.selectedCategory.name)
        )
      })
    }
  },
  methods: {
    searchPlaces () {
      // eslint-disable-next-line no-console
      console.log('Поиск Мест...')
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
