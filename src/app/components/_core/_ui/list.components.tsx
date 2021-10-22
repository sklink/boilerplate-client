// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';

export const IndentedList = withStyles(theme => ({
  root: {
    '& > .MuiListItem-root': {
      paddingLeft: `${theme.spacing(4)}px`
    }
  }
}))(List);
