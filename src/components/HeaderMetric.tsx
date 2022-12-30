import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  METRIC_SIZE_MAKE_IT_BIGGER,
  METRIC_SIZE_OF_BOX
} from '../lib/Constants';

const Metric = ({
  name,
  value,
  size = 'default'
}: {
  name: string;
  value?: string;
  size?: 'large' | 'default';
}) => {
  return (
    <Box
      sx={{
        width:
          size === 'large'
            ? METRIC_SIZE_OF_BOX * METRIC_SIZE_MAKE_IT_BIGGER
            : METRIC_SIZE_OF_BOX
      }}
    >
      <Typography
        variant="overline"
        display="block"
        noWrap
        sx={{
          paddingTop: 1,
          lineHeight: 'initial'
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: '165%'
        }}
        noWrap
      >
        <strong>{value ?? '-'}</strong>
      </Typography>
    </Box>
  );
};

export default Metric;
