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
        params: {
          name: 'Bobs Burgers',
        },
        children: [
          {
            type: 'menuitem',
            params: {
              price: 10,
            },
            children: [
              {
                type: 'ingredient',
                params: {
                  name: 'Ground Beef',
                  cost: 3,
                },
              },
              {
                type: 'ingredient',
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
