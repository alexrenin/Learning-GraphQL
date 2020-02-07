const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID,
	GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean} = graphql

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
		name: { type: new GraphQLNonNull(GraphQLString) },
		genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
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
		id: { type: new GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLString },
		age: { type: new GraphQLNonNull(GraphQLInt) },
		movies: {
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
				name: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)},
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
				name: {type: new GraphQLNonNull(GraphQLString)},
				genre: {type: new GraphQLNonNull(GraphQLString)},
				directorId: {type: GraphQLID},
                watched: { type: new GraphQLNonNull(GraphQLBoolean)},
                rate: { type: GraphQLInt},
			},
			resolve(parent, args) {
				const movie = new Movies({
					name: args.name,
					genre: args.genre,
					directorId: args.directorId,
                    watched: args.watched,
                    rate: args.rate,
				})
				return movie.save()
			},
		},
		deleteDirector: {
			type: DirectorType,
			args: { id: {type: GraphQLID}},
			resolve(parent, args) {
				return Directors.findByIdAndRemove(args.id)
			}
		},
		deleteMovie: {
			type: MovieType,
			args: { id: {type: GraphQLID}},
			resolve(parent, args) {
				return Movies.findByIdAndRemove(args.id)
			}
		},
		updateDirector: {
			type: DirectorType,
			args: {
				id: {type: GraphQLID},
				name: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)},
			},
			resolve(parent, args) {
				return Directors.findByIdAndUpdate(
					args.id,
					{ $set: {name: args.name, age: args.age}},
					{new: true, useFindAndModify: false}
				)
			}
		},
		updateMovie: {
			type: MovieType,
			args: {
				id: {type: GraphQLID},
				name: {type: new GraphQLNonNull(GraphQLString)},
				genre: {type: new GraphQLNonNull(GraphQLString)},
                watched: { type: new GraphQLNonNull(GraphQLBoolean)},
                rate: { type: GraphQLInt},
				directorId: {type: GraphQLID},
			},
			resolve(parent, args) {
				return Movies.findByIdAndUpdate(
					args.id,
					{ $set: {
					    name: args.name,
                        genre: args.genre,
                        directorId: args.directorId,
                        watched: args.watched,
                        rate: args.rate,
					}},
					{new: true, useFindAndModify: false}
				)
			}
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
            args: {name: {type: GraphQLString } },
			resolve(parent, { name }) {
				return Movies.find({
                    name: {
                        $regex: name,
                        $options: "i",
                    }
				})
			}
		},
		directors: {
			type: new GraphQLList(DirectorType),
            args: {name: {type: GraphQLString } },
            resolve(parent, { name }) {
				return Directors.find({
                    name: {
                        $regex: name,
                        $options: "i",
                    }
                })
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
})

