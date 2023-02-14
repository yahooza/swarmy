import React from 'react';
import type { FoursquarePhoto } from '../lib/Types';
import Masonry from '@mui/lab/Masonry';
import { ZERO } from '../lib/Constants';
import { Alert, AlertTitle, ImageList, ImageListItem } from '@mui/material';

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
    <ImageList variant="masonry" cols={3} gap={8}>
      {photos
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((photo) => {
          const img = photo.prefix + FOURSQUARE_IMAGE_DIMENSIONS + photo.suffix;
          return (
            <ImageListItem key={photo.id}>
              <img
                src={`${img}?w=162&auto=format`}
                srcSet={`${img}?w=162&auto=format&dpr=2 2x`}
                loading="lazy"
              />
            </ImageListItem>
          );
        })}
    </ImageList>
  );
};

export default PhotosList;
