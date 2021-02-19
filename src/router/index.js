import Vue from 'vue'
import VueRouter from 'vue-router'

import BaseLayout from '@/layouts/BaseLayout';
import MainLayout from '@/layouts/MainLayout';

import Home from '@/views/Home'
import Artwork from '@/views/Artwork'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      {
        path: '/',
        component: MainLayout,
        props: {safeArea: true},
        children: [
          {
            path: '/',
            redirect: '/home'
          },
          {
            path: '/home',
            name: 'Home',
            component: Home
          },
        ]
      },
      {
        path: '/',
        component: MainLayout,
        props: { showNav: false },
        children: [
          {
            path: '/artwork/:id',
            name: 'Artwork',
            component: Artwork
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
