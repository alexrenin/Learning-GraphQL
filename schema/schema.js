const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID,
	GraphQLInt, GraphQLList, } = graphql

const Movies = require('../model/movie')
const Directors = require('../model/director')

// const movies = [
// 	{"_id":{"$oid":"5e3bd59f1c9d4400005181f9"},"name":"name 1","genre":"ganre 1","directorId":"5e3bd5071c9d4400005181f8"},
// 	{"_id":{"$oid":"5e3bd79a1c9d4400005181fd"},"name":"Name 2","genre":"genre 1","directorId":"5e3bd6941c9d4400005181fa"},
// 	{id: 3, name: 'name 3', genre: 'genre2', directorId: '3',},
// 	{id: 4, name: 'name 4', genre: 'genre2', directorId: '4',},
// 	{id: '5', name: 'name 5', genre: 'genre1', directorId: '1',},
// 	{id: '6', name: 'name 6', genre: 'genre1', directorId: '1',},
// 	{id: 7, name: 'name 7', genre: 'genre2', directorId: '3',},
// 	{id: 8, name: 'name 8', genre: 'genre2', directorId: '4',},
// ]
// const directors = [
// 	{"_id":{"$oid":"5e3bd5071c9d4400005181f8"},"name":"Director 1","age":"31"},
// 	{"_id":{"$oid":"5e3bd6941c9d4400005181fa"},"name":"Director 2","age":{"$numberInt":"52"}},
// 	{"_id":{"$oid":"5e3bd7301c9d4400005181fb"},"name":"Director 3","age":{"$numberInt":"43"}},
// 	{"_id":{"$oid":"5e3bd7671c9d4400005181fc"},"name":"Director 4","age":{"$numberInt":"54"}},
// ]


const MovieType = new GraphQLObjectType({
	name: 'Movie',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		director: {
			type: DirectorType,
			resolve(parent, args) {
				return Directors.findById(parent.directorId)
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
				return Movies.find({ directorId: parent.id })
			}
		}
	})
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addDirector: {
			type: DirectorType,
			args: {
				name: {type: GraphQLString},
				age: {type: GraphQLInt},
			},
			resolve(parent, args) {
				const director = new Directors({
					name: args.name,
					age: args.age,
				})
				return director.save()
			},
		},
		addMovie: {
			type: MovieType,
			args: {
				name: {type: GraphQLString},
				genre: {type: GraphQLString},
				directorId: {type: GraphQLID},
			},
			resolve(parent, args) {
				const movie = new Movies({
					name: args.name,
					genre: args.genre,
					directorId: args.directorId,
				})
				return movie.save()
			},
		}
	}
})

const Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		movie: {
			type: MovieType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Movies.findById(args.id)
			}
		},
		director: {
			type: DirectorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Movies.findById(args.id)
			}
		},
		movies: {
			type: new GraphQLList(MovieType),
			resolve(parent, args) {
				return Movies.find({})
			}
		},
		directors: {
			type: new GraphQLList(DirectorType),
			resolve(parent, args) {
				return Directors.find({})
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
})

