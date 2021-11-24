import { Icon } from 'leaflet';

export const CellCenterIcon = new Icon({
  iconUrl: './markers/cell_center.svg',
  iconSize: [12, 72],
  iconAnchor: [6, 72],
});

export const CellCenterIconNormal = new Icon({
  iconUrl: './markers/cell_center_lime.svg',
  iconSize: [12, 72],
  iconAnchor: [6, 72],
});

export const CellCenterIconWarning = new Icon({
  iconUrl: './markers/cell_center_orange.svg',
  iconSize: [12, 72],
  iconAnchor: [6, 72],
});

export const CellCenterIconDanger = new Icon({
  iconUrl: './markers/cell_center_red.svg',
  iconSize: [12, 72],
  iconAnchor: [6, 72],
});

export const CellPhoneIcon = new Icon({
  iconUrl: './markers/cell_phone.svg',
  iconSize: [16, 32],
  iconAnchor: [8, 16],
});

export const CellPhoneIconBest = [
  new Icon({
    iconUrl: './markers/cell_phone_blue.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_blue_failure.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_blue_satisfied.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
];

export const CellPhoneIconGood = [
  new Icon({
    iconUrl: './markers/cell_phone_turquoise.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_turquoise_failure.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_turquoise_satisfied.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
];

export const CellPhoneIconPoor = [
  new Icon({
    iconUrl: './markers/cell_phone_orange.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_orange_failure.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_orange_satisfied.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
];

export const CellPhoneIconWorst = [
  new Icon({
    iconUrl: './markers/cell_phone_red.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_red_failure.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
  new Icon({
    iconUrl: './markers/cell_phone_red_satisfied.svg',
    iconSize: [16, 32],
    iconAnchor: [8, 16],
  }),
];
