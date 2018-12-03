export const bobBelcher = [
  {
    type: 'user',
    params: {
      firstName: 'Bob',
      lastName: 'Belcher',
      email: '{{email()}}',
      phone: '{{phone()}}',
    },
    children: [
      {
        type: 'menu',
        params: `
          mutation {
            addMenu(name: "Bob's Burgers") {
              id,
              name
            }
          }
        `,
      },
    ],
  },
];

export default {
  bobBelcher,
};
