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
      getTopFive: '/Guesthouse/top-five',
    },
    room: {
      getAll: '/Room',
      getById: (id: number) => `/Room/${id}`,
      create: '/Room',
      getByGuesthouseId: (guesthouseId: number) => `/Room/Guesthouse/${guesthouseId}`,
      update: (id: number) => `/Room/${id}`,
      delete: (id: number) => `/Room/${id}`,
      book: '/Room/Book',
    },
    users: {
      getAll: '/Users',
      getById: (id: string) => `/Users/${id}`,
      update: (id: string) => `/Users/${id}`,
    },
    authentication: {
      login: '/Authentication/Login',
      register: '/Authentication/Register',
    },
    bookings: {
      getById: (roomId: string) => `/Bookings/${roomId}`,
      getAll: (userId: number) => `/Bookings/User/${userId}`,
    },
  },
};
