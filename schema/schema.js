const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID } = graphql

const movies = [
	{id: '1', name: 'name 1', genre: 'genre1'},
	{id: '2', name: 'name 2', genre: 'genre1'},
	{id: 3, name: 'name 3', genre: 'genre2'},
	{id: 4, name: 'name 4', genre: 'genre2'},
]

const MovieType = new GraphQLObjectType({
	name: 'Movie',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString }
	})
})

const Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		movie: {
			type: MovieType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return movies.find(movie => movie.id == args.id)
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: Query,
})