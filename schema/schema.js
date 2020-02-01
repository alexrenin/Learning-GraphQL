const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID,
	GraphQLInt, GraphQLList, } = graphql

const movies = [
	{id: '1', name: 'name 1', genre: 'genre1', directorId: '1',},
	{id: '2', name: 'name 2', genre: 'genre1', directorId: '2',},
	{id: 3, name: 'name 3', genre: 'genre2', directorId: '3',},
	{id: 4, name: 'name 4', genre: 'genre2', directorId: '4',},
	{id: '5', name: 'name 5', genre: 'genre1', directorId: '1',},
	{id: '6', name: 'name 6', genre: 'genre1', directorId: '1',},
	{id: 7, name: 'name 7', genre: 'genre2', directorId: '3',},
	{id: 8, name: 'name 8', genre: 'genre2', directorId: '4',},
]

const directors = [
	{ id: '1', name: 'Director 1', age: 51},
	{ id: '2', name: 'Director 2', age: 52},
	{ id: '3', name: 'Director 3', age: 53},
	{ id: '4', name: 'Director 4', age: 54},
]

const MovieType = new GraphQLObjectType({
	name: 'Movie',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		director: {
			type: DirectorType,
			resolve(parent, args) {
				return directors.find(director => director.id == parent.id)
			}
		}
	})
})

const DirectorType = new GraphQLObjectType({
	name: 'Director',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		movie: {
			type: new GraphQLList(MovieType),
			resolve(parent, args) {
				return movies.filter(movie => movie.directorId == parent.id)
			}
		}
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
		},
		director: {
			type: DirectorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return directors.find(director => director.id == args.id)
			}
		},
		movies: {
			type: new GraphQLList(MovieType),
			resolve(parent, args) {
				return movies
			}
		},
		directors: {
			type: new GraphQLList(DirectorType),
			resolve(parent, args) {
				return directors
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: Query,
})