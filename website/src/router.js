import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Loan from './views/Loan.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {title:'NUS Collaterized Loan'},
      beforeEnter: (to,from,next) => {
        document.title = to.meta.title
        next()
      }
    },
    {
    	path: '/loan/:userID',
    	name: 'loan',
    	component: Loan,
      meta: {title:'Loan'},
      beforeEnter: (to,from,next) => {
        document.title = to.meta.title
        next()
      }
    }
    
  ]
})
