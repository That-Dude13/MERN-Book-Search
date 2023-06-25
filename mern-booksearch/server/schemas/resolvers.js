
const {Book, User} = require('../models');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password')
                .populate('savedBooks');
                
                return userData;
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
    
    saveBook: async (parent, {saveBookInput}, context) => {

        if (context.user) {
            const updatedBooks = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: saveBookInput} },
                { new: true }
            ).populate('savedBooks');
    
            return updatedBooks;
            }
         
            throw new AuthenticationError('You need to be logged in!');
    
            },
        
            removeBook: async (parent, {bookId}, context) => {   

        if (context.user) {
            const updatedBooks = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedBooks;
        
        }
    },
   },
 },
};


module.exports = resolvers;


