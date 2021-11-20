import React, { useState, useEffect } from 'react';
import {
  MapContainer, TileLayer, Circle, LayerGroup, LayersControl, Marker,
} from 'react-leaflet';
import { LatLngTuple, Map as LeafletMap } from 'leaflet';
import type StatReport from 'sr2rs';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import pino from 'pino';
import { useColorMode, Heading } from 'theme-ui';

import $ from './map.module.scss';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';

import { CellCenterIcon, CellPhoneIcon } from './marker-icon';

const rangeFactor = 1600;
const log = pino();

const Map = function Map() {
  const [colorMode] = useColorMode();
  const [uePositions, setUEPositions] = useState<(typeof Marker)[]>([]);
  const [cellCenters, setCellCenters] = useState<(typeof Marker)[]>([]);
  const [cellRanges, setCellRanges] = useState<(typeof Circle)[]>([]);
  const [floatingState] = useState<{
    map: LeafletMap | null;
    mapFlied: boolean;
  }>({
    map: null,
    mapFlied: false,
  });

  useEffect(() => {
    setInterval(() => {
      axios.get('/api/sr2rs').then((res) => {
        const report: typeof StatReport = res.data.data;

        if (res.data.error != null) {
          log.error(res.data.error);
          toast.error(
            <div>
              <b>
                Error&nbsp;Code&nbsp;:&nbsp;
                {res.data.error.code}
              </b>
              <br />
              <span>
                {res.data.error.details}
              </span>
            </div>,
          );
          return;
        }

        const cellCenter = [0, 0];
        const upc = []; // ue position candidates
        const ccc = []; // cell center candidates
        const crc = []; // cell range candidates

        report.cellReports.forEach((cr) => {
          // Cell center
          ccc.push(
            <Marker
              key={`ccc-${cr.NCGI}`}
              icon={CellCenterIcon}
              position={[cr.latitude, cr.longitude]}
            />,
          );
          cellCenter[0] += cr.latitude;
          cellCenter[1] += cr.longitude;

          // Cell ranage
          const range = cr.txPowerDB * rangeFactor;
          crc.push(
            <Circle
              key={`crc-${cr.NCGI}`}
              center={[cr.latitude, cr.longitude]}
              radius={range}
              pathOptions={{
                fillColor: '#f00',
                fillOpacity: 0.05,
                color: '#f00',
              }}
              stroke
            />,
          );
        });

        report.UEReports.forEach((ur) => {
          // UE position
          upc.push(
            <Marker
              key={`upc-${ur.IMSI}`}
              icon={CellPhoneIcon}
              position={[ur.latitude, ur.longitude]}
            />,
          );
        });

        if (!floatingState.mapFlied && floatingState.map) {
          const center: LatLngTuple = [
            cellCenter[0] / report.cellReports.length,
            cellCenter[1] / report.cellReports.length,
          ];
          floatingState.map.flyTo(center, 9.8);
          log.info(`Flied map into the initial center: ${center}`);
          floatingState.mapFlied = true;
          toast.success(
            <div>
              <b>
                Welcome&nbsp;to&nbsp;the&nbsp;
                <Heading as="span">Roadshow</Heading>
                !
              </b>
              <br />
              <span>
                Automatically flied to the center of visible cells.
              </span>
            </div>,
            {
              autoClose: 10000,
            },
          );
        }

        setCellCenters(ccc);
        setCellRanges(crc);
        setUEPositions(upc);
      });
    }, 1000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className={$.mapwrapper}>
        <MapContainer
          center={[36.0152831, 129.3309997]}
          zoom={14}
          scrollWheelZoom
          whenCreated={(m) => { floatingState.map = m; }}
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
            <LayersControl.Overlay checked name="Cell ranges">
              <LayerGroup>
                {cellRanges}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Cell centers">
              <LayerGroup>
                {cellCenters}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="UEs">
              <LayerGroup>
                {uePositions}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        draggable={false}
        theme={colorMode === 'dark' ? 'dark' : 'light'}
      />
    </>
  );
};

export default Map;
