import { ApolloServer, gql } from 'apollo-server';
import {MongoClient, ObjectId} from 'mongodb';
import {signup, login} from './resolvers/mutation';

export const start = async () => {
    const MONGO_URL = 'mongodb://localhost:27017/blog'

    // The GraphQL schema
    const typeDefs = gql`
    type Query {
        "A simple type for getting started!"
        hello: String,
        books: String
    }

    type User {
        username: String!,
        email: String!,
        password: String!
    }

    type AuthPayload {
        token: String!,
        user: User!
    }

    type Mutation {
        signup(email: String!, password: String!, username: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
    }
    `;

    // A map of functions which return data for the schema.
    const resolvers = {
        Query: {
            hello: () => 'world',
            books: (parent, args, context, info) => {
                console.log(context.req)
                console.log("---")
                console.log(context.myProperty); // Will be `true`!
                return "books";
            },
        },
        Mutation: {
            signup, login
        }
    };

    const client = await MongoClient.connect(MONGO_URL)
    const db = client.db("yahska_auth")

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async({req}) => {
            return {
                db: db,
                req: req,
                myProperty: true
            };
        }
    });

    
    console.log("Mongo connected")

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

start()
