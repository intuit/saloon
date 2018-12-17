export default [
  {
    type: 'restaurant',
    url: 'http://localhost:3000/api/restaurant',
  },
  {
    type: 'menu',
    query: `
      mutation ($userId: ID, $name: String) {
        addMenu(userId: $userId, name: $name) {
          id,
          name,
          userId
        }
      }
    `,
    variables: data => ({
      userId: data.restaurant.restaurant_id,
    }),
    url: 'http://localhost:3000/graphql',
  },
  {
    type: 'menuitem',
    query: `
      mutation ($menuId: ID) {
        addMenuItem(name: "Hamburger", price: 10, menuId: $menuId) {
          id,
          name,
          price,
          menuId
        }
      }
    `,
    variables: data => ({
      menuId: data.restaurant.menu[0].addMenu.id,
    }),
    url: 'http://localhost:3000/graphql',
  },
  {
    type: 'ingredient',
    url: 'http://localhost:3000/api/ingredient',
  },
];
