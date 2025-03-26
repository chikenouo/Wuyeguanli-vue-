import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/layout/index.vue'
import Workshop from '@/components/workshop/index.vue'
import Dashboard from '@/components/dashboard/index.vue'
import directory from '@/components/directory/index.vue'
import Homepage from '@/components/homepage/index.vue'
import Rule from '@/components/rule/index.vue'
import History from '@/components/history/index.vue'
import Fee from '@/components/fee/index.vue'
import Login from '@/components/login/index.vue'
import Parking from '@/components/parking/index.vue'
import { ElMessage } from 'element-plus'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: '',
            component: Layout,
            redirect: '/login',
            children: [
                { path: '/homepage', name: 'homepage', component: Homepage, meta: { requiresAuth: true } },
                { path: '/workshop', name: 'workshop', component: Workshop, meta: { requiresAuth: true } },
                { path: '/rule', name: 'rule', component: Rule, meta: { requiresAuth: true } },
                { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
                { path: '/directory', name: 'directory', component: directory, meta: { requiresAuth: true } },
                { path: '/history', name: 'history', component: History, meta: { requiresAuth: true } },
                { path: '/fee', name: 'fee', component: Fee, meta: { requiresAuth: true } },
                { path: '/parking', name: 'parking', component: Parking, meta: { requiresAuth: true }}
            ]
        },
        { path: '/login', name: 'login', component: Login },
    ]
})

// 全局前置守衛
router.beforeEach((to, from, next) => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null')
    const isAuthenticated = loginUser && loginUser.token

    // 如果已登入，訪問 /login 時重定向到 /homepage
    if (to.name === 'login' && isAuthenticated) {
        next('/homepage')
    }
    // 如果訪問受保護頁面且未登入，重定向到 /login
    else if (to.meta.requiresAuth && !isAuthenticated) {
        ElMessage.warning('請先登入')
        next('/login')
    } else {
        next()
    }
})

export default router