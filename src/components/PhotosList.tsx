import React from 'react';
import type { FoursquarePhoto } from '../lib/Types';
import Masonry from '@mui/lab/Masonry';
import { ZERO } from '../lib/Constants';
import { Alert, AlertTitle } from '@mui/material';

const FOURSQUARE_IMAGE_DIMENSIONS = '60x60';

const PhotosList = ({
  photos
}: {
  photos: FoursquarePhoto[] | null | undefined;
}) => {
  if (photos == null || photos.length <= ZERO) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No photos yet.
      </Alert>
    );
  }
  return (
    <Masonry columns={3} spacing={1}>
      {photos.map((photo) => {
        const img = photo.prefix + FOURSQUARE_IMAGE_DIMENSIONS + photo.suffix;
        return (
          <div key={photo.id}>
            <img
              src={`${img}?w=162&auto=format`}
              srcSet={`${img}?w=162&auto=format&dpr=2 2x`}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%'
              }}
            />
          </div>
        );
      })}
    </Masonry>
  );
};

export default PhotosList;
