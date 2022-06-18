const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');
// Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');


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
                return( Client.findByIdAndRemove(args.id) );
            }
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