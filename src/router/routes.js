const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Home.vue'),
        meta: { showDrawer: true, requireAuth: true },
        name: 'Home'
      },
      {
        path: '/login',
        component: () => import('pages/Login.vue'),
        meta: { hideHeader: true, hideFooter: true },
        name: 'Login'
      },
      {
        path: '/signup',
        component: () => import('pages/Signup.vue'),
        meta: { hideHeader: true, hideFooter: true },
        name: 'SignUp'
      },
      {
        path: '/inbox',
        component: () => import('pages/Inbox.vue'),
        meta: { requireAuth: true },
        name: 'Inbox'
      },
      {
        path: '/explore',
        component: () => import('pages/Explore.vue'),
        meta: { requireAuth: true },
        name: 'Explore'
      },
      {
        path: '/activity',
        component: () => import('pages/Activity.vue'),
        meta: { requireAuth: true },
        name: 'Activity'
      },
      {
        path: '/me/',
        component: () => import('pages/Profile.vue'),
        meta: { requireAuth: true },
        name: 'Profile'
      },
      {
        path: '/about',
        component: () => import('pages/About.vue'),
        meta: { hideHeader: true, hideFooter: true },
        name: 'About'
      },
      {
        path: '/test',
        component: () => import('pages/Test.vue'),
        name: 'Test'
      },
      {
        path: '/post-image',
        component: () => import('pages/PostImage.vue'),
        meta: { requireAuth: true },
        name: 'PostImage'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('pages/Error404.vue'),
    props: true
  }
]

export default routes
