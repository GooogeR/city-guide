/* eslint-disable import/named */
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue' // Путь к компоненту Login
import Profile from '../views/Profile.vue' // Путь к компоненту Profile (личный кабинет)
import Home from '../views/Home.vue' // Путь к главной странице
import PlaceDetails from '../views/PlaceDetails.vue' // Путь к компоненту PlaceDetails

// Настройка маршрутов
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home // Главная страница
  },
  {
    path: '/login',
    name: 'Login',
    component: Login // Страница логина
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile, // Страница личного кабинета
    meta: { requiresAuth: true } // Страница требует авторизации
  },
  {
    path: '/city/:id', // Страница с подробной информацией о месте
    name: 'PlaceDetails',
    component: PlaceDetails, // Компонент для отображения подробностей
    meta: { requiresAuth: true } // Страница требует авторизации
  }
]

// Создание и экспорт роутера
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Защита маршрутов от неавторизованных пользователей
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') // Проверяем, есть ли токен в localStorage

  if (to.meta.requiresAuth && !token) {
    next('/login') // Перенаправляем на страницу логина, если нет токена
  } else {
    next() // Если токен есть или маршрут не требует авторизации
  }
})

export default router
