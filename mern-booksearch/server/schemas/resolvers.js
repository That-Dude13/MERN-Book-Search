const {AuthenticationError} = require('apollo-sever-express');
const {Book, User} = require('../models');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query:{
        getSingleUser: async (parent, {username = null, params}) => {
            if (username) {
                return User.findOne({username}).populate('savedBooks');
            }
            return User.findOne(params).populate('savedBooks');

            },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user._id}).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        
    
    }
 },

    Mutation: {
   


    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return {token, user};
    },
    login: async (parent, {email, password}) => {
        const user = await User.findOne({email});
        if (!user) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return {token, user};
    },
    saveBook: async (parent, {bookData}, context) => {

        if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: bookData } },
                { new: true }
            );
    
            return updatedUser;
            }
         
            },
        removeBook: async (parent, {bookId}, context) => {   

        if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        }
    },
}
};

module.exports = resolvers;

