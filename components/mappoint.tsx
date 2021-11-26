import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  LayerGroup, LayersControl, MapContainer, Marker, TileLayer,
} from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import pino from 'pino';

import { useColorMode } from 'theme-ui';

import { CellCenterIconNormal } from './marker-icon';
import $ from './map.module.scss';

const log = pino();

const point: LatLngTuple = [0, 0];
let isPointSet = false;
let map = null;

const Map = function Map() {
  const [colorMode] = useColorMode();
  const [cellCenters, setCellCenters] = useState<(typeof Marker)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (router.query.points && router.query.points.length > 0) {
      const points = Array.isArray(router.query.points) ? router.query.points.join('!').split('!') : router.query.points.split('!');
      const markers = [];

      log.info('points:', points);

      let latSum = 0;
      let lngSum = 0;
      let validPoints = 0;

      points.forEach((p) => {
        const tp = p.trim();
        if (tp.length === 0) {
          return;
        }
        if (tp.indexOf(',') < 0) {
          return;
        }
        const [lat, lng] = tp.split(',').map((x) => Number.parseFloat(x.trim()));
        markers.push(<Marker key={`cell-${lat}-${lng}`} icon={CellCenterIconNormal} position={[lat, lng]} />);
        latSum += lat;
        lngSum += lng;
        validPoints += 1;
      });

      setCellCenters(markers);

      if (map === null) {
        if (validPoints > 0) {
          point[0] = latSum / validPoints;
          point[1] = lngSum / validPoints;
          isPointSet = true;
        }
      } else if (validPoints > 0) {
        map.setView([latSum / validPoints, lngSum / validPoints], 12);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={$.mapwrapper}>
      <MapContainer
        center={[36.0152831, 129.3309997]}
        zoom={12}
        scrollWheelZoom
        whenCreated={(m) => {
          if (isPointSet) {
            m.setView(point, 12);
          } else {
            map = m;
          }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Map: Default">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={colorMode === 'dark'} name="Map: Dark">
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={colorMode === 'light'} name="Map: Light">
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Points">
            <LayerGroup>
              {cellCenters}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default Map;
