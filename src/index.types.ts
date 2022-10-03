export type FoursquareVenue = {
  id: string,
  name: string,
  location: {
    lat: number,
    lng: number,
    formattedAddress: [string],
    postalCode: string,
    country: string
  }
}

export type FoursquareCheckin = {
  id: string,
  createdAt: number,
  photos: [{
    items: [
      id: string,
      createdAt: number,
      prefix: string,
      suffix: string,
      width: number,
      height: number
    ]
  }],
  venue: FoursquareVenue
}

export type FoursquareVenueWithCheckins = {
  venue: FoursquareVenue
  checkins: FoursquareCheckin[]
}

export type CSSStyles = {
  [key: string]: string | number;
}
