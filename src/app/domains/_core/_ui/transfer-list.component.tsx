import _ from 'lodash';
import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

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
    <Grid container spacing={2} justifyContent="center" alignItems="center" className={classes.root}>
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
