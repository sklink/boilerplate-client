import _ from 'lodash';
import React from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

// Interfaces
import { IFormOption } from './forms.component';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a: IFormOption[], b: IFormOption[]): IFormOption[] {
  return _.filter(a, a => !_.find(b, b => b.value === a.value));
}

function intersection (a: IFormOption[], b: IFormOption[]): IFormOption[] {
  return _.filter(a, a => Boolean(_.find(b, b => b.value === a.value)));
}

interface ITransferList {
  left: Array<IFormOption>;
  right: Array<IFormOption>;
  setLeft: Function;
  setRight: Function;
}

export const TransferList: React.FC<ITransferList> = ({ setLeft, setRight, left, right }) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState<IFormOption[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (item: IFormOption) => () => {
    const nextChecked: IFormOption[] = [...checked];

    if (_.find(nextChecked, (curr: IFormOption) => curr.value === item.value)) {
      _.remove(nextChecked, (curr: IFormOption) => curr.value === item.value);
    } else {
      nextChecked.push(item);
    }

    setChecked(nextChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items: IFormOption[]) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((item: IFormOption) => {
          const labelId = `transfer-list-item-${item.value}-label`;
          const isChecked = Boolean(_.find(checked, (curr: IFormOption) => curr.value === item.value));

          return (
            <ListItem key={item.value} role="listitem" button onClick={handleToggle(item)}>
              <ListItemIcon>
                <Checkbox
                  checked={isChecked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.label} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  );
}
