<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <nav>
    <router-link to="/">
      Главная
    </router-link>
    <router-link to="/login">
      Войти
    </router-link>
    <router-link to="/profile">
      Личный кабинет
    </router-link>
  </nav>
  <router-view />
</template>
