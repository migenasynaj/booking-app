export const environment = {
  production: false,
  apiUrl: 'https://booking-api.asystems.al/api',

  endpoints: {
    guesthouse: {
      getAll: '/Guesthouse',
      getById: (id: number) => `/Guesthouse/${id}`,
      create: '/Guesthouse',
      update: (id: number) => `/Guesthouse/${id}`,
      delete: (id: number) => `/Guesthouse/${id}`,
    },
    room: {
      getAll: '/Room',
      getById: (id: number) => `/Room/${id}`,
      create: '/Room',
      getByGuesthouseId: (guesthouseId: number) => `/Room/Guesthouse/${guesthouseId}`,
      update: (id: number) => `/Room/${id}`,
      delete: (id: number) => `/Room/${id}`,
    },
    users: {
      getAll: `/Users`,
      getById: (id: number) => `/Room/${id}`,
      update: (id: number) => `/Room/${id}`,
    },
    authentication: {
      login: '/Authentication/Login',
      register: '/Authentication/Register',
    },
  },
};
