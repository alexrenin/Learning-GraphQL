import { compose } from 'recompose';
import {graphql} from 'react-apollo/lib/index'

import {moviesQuery} from '../MoviesTable/queries'
import { deleteMovieMutation } from './mutation'

const withGraphqlDelete = graphql(deleteMovieMutation, {
    props: ({ mutate }) => ({
        deleteMovie: id => mutate({
            variables: id,
            refetchQueries: [{
                query: moviesQuery,
                variables: { name: '' }
            }]
        })
    })
})

export default compose(
    withGraphqlDelete,
);
