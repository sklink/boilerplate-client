import withStyles from '@mui/styles/withStyles';
import List from '@mui/material/List';

export const IndentedList = withStyles(theme => ({
  root: {
    '& > .MuiListItem-root': {
      paddingLeft: theme.spacing(4)
    }
  }
}))(List);
