/* eslint import/no-extraneous-dependencies: 0 */

import { graphqlRestify } from 'apollo-server-restify';
import { makeExecutableSchema } from 'graphql-tools';

const menus = [];
const menuitems = [];


const QuerySchema = `
  type Query {
    menus: [Menu!]!,
    menuitems: [MenuItem!]!
  }
`;

const MutationSchema = `
  type Mutation {
    addMenu(name: String, userId: ID): Menu,
    addMenuItem(name: String, price: Int, menuId: ID): MenuItem
  }
`;

const MenuSchema = `
  type Menu {
    id: ID,
    name: String
    userId: ID
    menuitemIds: [ID!]!
  }
`;

const MenuItemSchema = `
  type MenuItem {
    id: ID,
    name: String,
    price: Int,
    menuId: ID
  }
`;

export default function graphqlApi(server) {
  const resolvers = {
    Query: {
      menus: () => menus,
      menuitems: () => menuitems,
    },
    Mutation: {
      addMenu: (root, { name, userId }) => {
        const entity = {
          id: '12345',
          userId,
          name,
          menuitemIds: [],
        };
        menus.push(entity);
        return entity;
      },
      addMenuItem: (root, { name, price, menuId }) => {
        const entity = {
          id: '56789',
          name,
          price,
          menuId,
        };
        menuitems.push(entity);

        const parentEntity = menus.find(tmp => parseInt(menuId, 10) === parseInt(tmp.id, 10));
        if (parentEntity) {
          parentEntity.menuitemIds.push(entity.id);
        }
        return entity;
      },
    },
  };

  const schema = makeExecutableSchema({
    typeDefs: [QuerySchema, MutationSchema, MenuSchema, MenuItemSchema],
    resolvers,
  });
  const graphQLOptions = { schema };

  server.post('/graphql', graphqlRestify(graphQLOptions));
  server.get('/graphql', graphqlRestify(graphQLOptions));
}
