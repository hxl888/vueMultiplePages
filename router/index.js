import Vue from 'Vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: 'login',
    name: 'login',
    component: r => {
      require(['./index'], r)
    },
    meta: {
      title: '登录'
    }
  }
]

export default new VueRouter({
  routes: routes
})
