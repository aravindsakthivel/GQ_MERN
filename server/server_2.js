const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors")

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log('Database is connected');
    }
  },
);


app.use(cors())
app.use(bodyParser.json());
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
const User = require('./models/user');

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type RootQuery {
      user(id: ID!): User!
    }

    type RootMutation {
      addUser(userInput : UserInput!): User!
    }

    type User {
      _id: ID!
      email: String!
      password: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      addUser: async (args) => {
        try {
          const user = new User({
            email: args.userInput.email,
            password: args.userInput.password,
          });
          const result = await user.save();
          return {
            ...result._doc,
          };
        } catch (error) {
          throw err;
        }
      },
      user: async (args) => {
        try {
          const user = await User.findOne({ _id: args.id });
          return {
            ...user._doc
          }
        } catch (error) {
          throw err;
        }
      },
    },
    graphiql: true,
  }),
);

app.listen(PORT, () => {
  console.log(`Running at port ${PORT}`);
});
