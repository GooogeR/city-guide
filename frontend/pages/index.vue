<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-row>
      <v-col v-for="place in places" :key="place.id" cols="12" md="4">
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
      places: [
        { id: 1, name: 'Краснодарский стадион "Кубань"', category: 'Спортивные объекты', image: 'https://via.placeholder.com/300' },
        { id: 2, name: 'Парк им. 30-летия Победы', category: 'Парки', image: 'https://via.placeholder.com/300' },
        { id: 3, name: 'Краснодарский театр драмы', category: 'Культура и искусство', image: 'https://via.placeholder.com/300' }
      ]
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
