<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-img :src="city.image" height="300px" />
          <v-card-title>{{ city.name }}</v-card-title>
          <v-card-subtitle>{{ city.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary">
              Посмотреть на карте
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="place in city.places" :key="place.id" cols="12" md="4">
        <v-card>
          <v-img :src="place.image" height="200px" />
          <v-card-title>{{ place.name }}</v-card-title>
          <v-card-subtitle>{{ place.category }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      city: {
        name: 'Краснодар',
        description: 'Краснодар — это город с богатой культурой и множеством интересных мест для посещения.',
        image: 'https://via.placeholder.com/1200x500',
        places: [
          { id: 1, name: 'Парк им. 30-летия Победы', category: 'Парки', image: 'https://via.placeholder.com/300' },
          { id: 2, name: 'Краснодарский стадион "Кубань"', category: 'Спортивные объекты', image: 'https://via.placeholder.com/300' },
          { id: 3, name: 'Краснодарский театр драмы', category: 'Культура и искусство', image: 'https://via.placeholder.com/300' }
        ]
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
