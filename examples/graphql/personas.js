export const bobBelcher = [
  {
    type: 'restaurant',
    params: {
      owner: 'Bob Belcher',
      name: 'Bobs Burgers',
    },
    children: [
      {
        type: 'menu',
        params: `
          mutation ($userId: ID, $name: String) {
            addMenu(userId: $userId, name: $name) {
              id,
              name,
              userId
            }
          }
        `,
        children: [
          {
            type: 'menuitem',
            params: `
              mutation ($menuId: ID) {
                addMenuItem(name: "Hamburger", price: 10, menuId: $menuId) {
                  id,
                  name,
                  price,
                  menuId
                }
              }
            `,
            children: [
              {
                type: 'ingredient',
                url: 'http://localhost:3000/api/ingredient',
                params: {
                  name: 'Ground Beef',
                  cost: 3,
                },
              },
              {
                type: 'ingredient',
                url: 'http://localhost:3000/api/ingredient',
                params: {
                  name: 'Bun',
                  cost: 1,
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default {
  bobBelcher,
};
