/* eslint import/no-extraneous-dependencies: 0 */

import { graphqlRestify } from 'apollo-server-restify';
import { makeExecutableSchema } from 'graphql-tools';

function buildID() {
  return Math.ceil(Math.random() * 100000000);
}

const menus = [];
const menuitems = [];


const QuerySchema = `
  type Query {
    menus: [Menu],
    menuitems: [MenuItem]
  }
`;

const MutationSchema = `
  type Mutation {
    addMenu(name: String): Menu,
    addMenuItem(name: String, price: Int): MenuItem
  }
`;

const MenuSchema = `
  type Menu {
    id: ID,
    name: String
    menuitems: [MenuItem]
  }
`;

const MenuItemSchema = `
  type MenuItem {
    id: ID,
    name: String,
    price: Int
  }
`;

export default function graphqlApi(server) {
  const resolvers = {
    Query: {
      menus: () => menus,
      menuitems: () => menuitems,
    },
    Mutation: {
      addMenu: (root, { name }) => {
        const menu = { id: buildID, name };
        menus.push(menu);
        return menu;
      },
      addMenuItem: (root, { name, price }) => {
        const menuitem = { id: buildID, name, price };
        menuitems.push(menuitem);
        return menuitem;
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
