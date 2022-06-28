require('dotenv').config();

// GraphQL imports
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType, GraphQLError } = require('graphql');

// JWT
const jwt = require("jsonwebtoken");

// Mongoose models imports
const Project = require('../models/Project');
const Client = require('../models/Client');
const User = require('../models/User');


// user type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString },
    })
})

// client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

// project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        }
    })
});

// ********************** QUERIES **********************
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
            },
        },

        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            },
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            },
        },
        projects: { 
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            },
        },
    },
});

// ********************** MUTATIONS **********************
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        // REGISTER USER
        registerUser: {
            type: UserType,
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve( parent, args ) {

                const user = new User({
                    username: args.username,
                    email: args.email,
                    password: args.password
                });

                const token = jwt.sign(
                    { user_id: user._id, email: user._email },
                    process.env.SECRET,
                    {
                        expiresIn: "2h",
                    }
                    );
                
                user.token = token;

                return user.save();
            }
        },

        // LOGIN USER
        loginUser: {
            type: UserType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return User.findOne({ email: args.email }).then((user) => {
                    if(user && user.password === args.password) {
                        const token = jwt.sign(
                            { user_id: user.id, email: user.email },
                            process.env.SECRET,
                            {
                                expiresIn: "2h",
                            }
                            );
                                
                        user.token = token;
                        return user.save();
                    } else {
                        return new GraphQLError("Wrong email or password");
                    }
                });
            }
        },

        // ADD CLIENT
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });

                return client.save();
            }
        },

        // DELETE CLIENT
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                Project.find({ clientId: args.id }).then((projects) => {
                    projects.forEach(project => { project.remove(); });
                })

                return( Client.findByIdAndRemove(args.id) );
            }
        },

         // UPDATE CLIENT
        updateClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Client.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        },
                    },
                );
            },
        },

        // ADD PROJECT
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                type: new GraphQLEnumType({
                    name: 'ProjectStatus',
                    values: {
                    new: { value: 'Not Started' },
                    started: { value: 'In Progress' },
                    completed: { value: 'Completed' },
                    },
                }),
                defaultValue: 'Not Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
            const project = new Project({
            name: args.name,
            description: args.description,
            status: args.status,
            clientId: args.clientId,
            });

            return project.save();
                }
            },

         // DELETE PROJECT
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return( Project.findByIdAndRemove(args.id) );
            }
        },

        // UPDATE PROJECT
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'UpdateProjectStatus',
                        values: {
                        new: { value: 'Not Started' },
                        started: { value: 'In Progress' },
                        completed: { value: 'Completed' },
                        },
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                        },
                    },
                );
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})