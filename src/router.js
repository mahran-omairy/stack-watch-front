import Vue from 'vue'
import VueRouter from 'vue-router';
import Login from "./components/login.vue"
import Register from "./components/register.vue"
import NotFound from "./components/404.vue"
import OverView from "./components/overview.vue"
import Profile from "./components/profile.vue"
import Category from "./components/category.vue"
import CategoriesList from "./components/categories-list.vue"
import store from "./store"

Vue.use(VueRouter)



const routes = [
    {
        path: '/login', component: Login, beforeEnter(to, from, next) {
            store.dispatch("user/autoLogin", { next })
        }
    },
    {
        path: '/register', component: Register, beforeEnter(to, from, next) {
            store.dispatch("user/autoLogin", { next })
        }
    },
    { path: '/404', component: NotFound },
    {
        path: '/overview', component: OverView, beforeEnter(to, from, next) {
            store.dispatch("user/checkLogin", { next })
        }
        , children: [
            {
                path: '', component: CategoriesList, beforeEnter(to, from, next) {
                    store.dispatch("user/checkLogin", { next })
                }
            },
            
            {
                path: ':id', component: Category, beforeEnter(to, from, next) {
                    store.dispatch("user/checkLogin", { next })
                }
            }
        ]
    },
    {
        path: '/profile', component: Profile, beforeEnter(to, from, next) {
            store.dispatch("user/checkLogin", { next })
        }
    },
    { path: '/', redirect: "/login" },
    { path: '*', redirect: "/404" }

]

const router = new VueRouter({
    routes
})

export default router;