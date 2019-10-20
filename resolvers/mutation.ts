const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function login(parent, args, context, info){
    const userCollection = context.db.collection("users")
    const user = await userCollection.findOne({email: args.email})
    if (!user) {
        throw new Error('No such user found')
    }
    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid){
        throw new Error("Password not valid")
    }
    const token = jwt.sign({userID: user.id}, "test")

    return {
        token,
        user
    }
}

async function signup(parent, args, context, info){
    const {username, email} = args
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(args.password, salt)
    const users = context.db.collection("users")
    const user = await users.insertOne({username, email, password})
    const token = jwt.sign({userID: user.id}, "test")
    return {
        token,
        user
    }
}

export {
    login, signup
}