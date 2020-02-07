import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import {graphql} from 'react-apollo/lib/index'

import { styles } from './styles';
import {moviesQuery} from '../MoviesTable/queries'
import { directorsQuery } from './queries'
import { addMovieMutation } from './mutation'

const withGraphqlAdd = graphql(addMovieMutation, {
    props: ({ mutate }) => ({
        addMovie: movie => mutate({
            variables: movie,
            refetchQueries: [{ query: moviesQuery }]
        })
    })
})


export default compose(
    withStyles(styles),
    withGraphqlAdd,
    graphql(directorsQuery)
);
