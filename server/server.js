const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ApolloServer, gql } = require('apollo-server');

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

const User = require('./models/user');

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
  }

  type Mutation {
    addUser(userInput: UserInput!): User!
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
`;

const resolvers = {
  Query: {
    user: async (parents, args) => {
      try {
        const user = await User.findOne({ _id: args.id });
        return {
          ...user._doc,
        };
      } catch (error) {
        throw err;
      }
    },
  },
  Mutation: {
    addUser: async (parents, args) => {
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
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


server.listen(PORT, () => {
  console.log(`Running at port ${PORT}`);
});
