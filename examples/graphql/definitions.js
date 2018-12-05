export default [
  {
    type: 'restaurant',
    url: 'http://localhost:3000/api/restaurant',
  },
  {
    type: 'menu',
    transport: 'graphql',
    variables: data => ({
      userId: data.restaurant.restaurant_id,
      name: 'Bobs Burgers',
    }),
    url: 'http://localhost:3000/graphql',
  },
  {
    type: 'menuitem',
    transport: 'graphql',
    variables: data => ({
      menuId: data.restaurant.menu[0].addMenu.id,
      price: 10,
    }),
    url: 'http://localhost:3000/graphql',
  },
  {
    type: 'ingredient',
    url: 'http://localhost:3000/api/ingredient',
  },
];
