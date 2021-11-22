import React, { useEffect, useState } from 'react';

import axios from 'axios';

import {
  Circle, LayerGroup, LayersControl, MapContainer, Marker, Polyline, TileLayer, Tooltip, SVGOverlay,
} from 'react-leaflet';
import { LatLngTuple, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import moment from 'moment';
import pino from 'pino';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import type StatReport from 'sr2rs';
import { Heading, useColorMode } from 'theme-ui';

import {
  CellCenterIconNormal, CellCenterIconWarning, CellCenterIconDanger, CellPhoneIconBest,
  CellPhoneIconGood, CellPhoneIconPoor, CellPhoneIconWorst, CellPhoneIcon, CellCenterIcon,
} from './marker-icon';
import $ from './map.module.scss';

const rangeFactor = 500;
const log = pino();
const stateLevel = (process.env.NEXT_PUBLIC_UE_STATELEVEL || '-106,-116,-126,-156').split(',').map((x) => Number.parseFloat(x));
const loadLevel = (process.env.NEXT_PUBLIC_CELL_LOADLEVEL || '0.95,0.75,0.0').split(',').map((x) => Number.parseFloat(x));

let avabCellLinesDisappearTimeout: number;
let avabCellTargetUE = null;
let connUELinesDisappearTimeout: number;
let connUETargetCell = null;

const cellLabelReplaces = ['A', 'B', 'C', 'D', 'E', 'F'];
const getCellLabel = (ncgi: number) => {
  if (process.env.NEXT_PUBLIC_SHOW_RAW_NCGI === 'true') {
    return ncgi.toString();
  }
  const exLabel = Number(ncgi % 257).toString(6);
  let reLabel = '';
  for (let i = 0; i < exLabel.length; i += 1) {
    reLabel += cellLabelReplaces[exLabel[i]];
  }
  return reLabel;
};

const Map = function Map() {
  const [colorMode] = useColorMode();
  const [uePositions, setUEPositions] = useState<(typeof Marker)[]>([]);
  const [cellCenters, setCellCenters] = useState<(typeof Marker)[]>([]);
  const [cellRanges, setCellRanges] = useState<(typeof Circle)[]>([]);
  const [cellLabels, setCellLabels] = useState<(typeof SVGOverlay)[]>([]);
  const [assocLines, setAssocLines] = useState<(typeof Polyline)[]>([]);
  const [avabCellLines, setAvabCellLines] = useState<(typeof Polyline)[]>([]);
  const [connUELines, setConnUELines] = useState<(typeof Polyline)[]>([]);
  const [floatingState] = useState<{
    map: LeafletMap | null;
    mapFlied: boolean;
  }>({
    map: null,
    mapFlied: false,
  });

  useEffect(() => {
    setInterval(() => {
      if (document.hidden) {
        return;
      }

      axios.get('/api/sr2rs', {
        headers: { 'Request-Time': moment().format('x') },
        timeout: 5300,
      }).then((res) => {
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
        const clc = []; // cell label candidates
        const alc = []; // association line candidates

        report.cellReports.forEach((cr) => {
          // Cell highlighting
          const cucHighlight = () => {
            const cuc = []; // connected ue-line candidates
            report.UEReports.forEach((ur) => {
              if (ur.associatedNCGI === cr.NCGI) {
                cuc.push(
                  <Polyline
                    key={`cuc-${cr.NCGI}-${ur.IMSI}`}
                    positions={[
                      [ur.latitude, ur.longitude],
                      [cr.latitude, cr.longitude],
                    ]}
                    color="var(--theme-ui-colors-cella)"
                    weight={2}
                    opacity={1}
                    smoothFactor={1}
                  />,
                );
              }
            });
            setConnUELines(cuc);
          };
          if (cr.NCGI === connUETargetCell) {
            cucHighlight();
          }

          // Cell icon selection
          let icon = CellCenterIcon;
          if (cr.load > loadLevel[0]) {
            icon = CellCenterIconDanger;
          } else if (cr.load > loadLevel[1]) {
            icon = CellCenterIconWarning;
          } else if (cr.load > loadLevel[2]) {
            icon = CellCenterIconNormal;
          }

          // Cell center
          ccc.push(
            <Marker
              key={`ccc-${cr.NCGI}`}
              icon={icon}
              position={[cr.latitude, cr.longitude]}
              eventHandlers={{
                click: () => {
                  clearTimeout(connUELinesDisappearTimeout);
                  connUETargetCell = cr.NCGI;
                  cucHighlight();
                  avabCellLinesDisappearTimeout = setTimeout(() => {
                    setConnUELines([]);
                    connUETargetCell = '';
                  }, 5000) as unknown as number;
                },
              }}
            >
              <Tooltip opacity={0.7} direction="bottom">
                <b>{`[${cr.NCGI}]`}</b>
                &nbsp;(TX:&nbsp;
                <span>{cr.txPowerDB}</span>
                )
                <br />
                <span>Load&nbsp;:&nbsp;</span>
                <span>{cr.load}</span>
              </Tooltip>
            </Marker>,
          );
          cellCenter[0] += cr.latitude;
          cellCenter[1] += cr.longitude;

          // Cell label
          clc.push(
            <SVGOverlay key={`clc-${cr.NCGI}`} bounds={[[cr.latitude - 0.01, cr.longitude - 0.01], [cr.latitude, cr.longitude + 0.01]]}>
              <text
                x="50%"
                y="1em"
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="2em"
                fontWeight="bold"
                fill="var(--theme-ui-colors-text)"
                stroke="var(--theme-ui-colors-primary)"
                strokeWidth="0.01em"
              >
                {getCellLabel(cr.NCGI)}
              </text>
            </SVGOverlay>,
          );

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
              stroke={false}
            />,
          );
        });

        report.UEReports.forEach((ur) => {
          if (ur.isRRCIdle) {
            upc.push(
              <Marker
                key={`upc-${ur.IMSI}`}
                icon={CellPhoneIcon}
                position={[ur.latitude, ur.longitude]}
              >
                <Tooltip opacity={0.7} direction="bottom">
                  <b>{`[${ur.IMSI}]`}</b>
                  <br />
                  <span>Not connected to any eNodeB</span>
                </Tooltip>
              </Marker>,
            );
            return;
          }

          // RSRP information calculation
          let currentRSRP = 0;
          let isCurrentRSRPMax = false;
          let highestRSRP = -20000;
          let highestNCGI = 0;
          for (const uecr of ur.UECellReports) {
            if (uecr.NCGI === ur.associatedNCGI) {
              currentRSRP = uecr.RSRP;
            }
            if (uecr.RSRP > highestRSRP) {
              highestRSRP = uecr.RSRP;
              highestNCGI = uecr.NCGI;
            }
          }
          if (Math.abs(currentRSRP - highestRSRP) < 1.1) {
            isCurrentRSRPMax = true;
          }

          // Icon selection
          let icon = CellPhoneIcon;
          if (stateLevel.length > 0 && currentRSRP > stateLevel[0]) {
            icon = CellPhoneIconBest[Number(isCurrentRSRPMax)];
          } else if (stateLevel.length > 1 && currentRSRP > stateLevel[1]) {
            icon = CellPhoneIconGood[Number(isCurrentRSRPMax)];
          } else if (stateLevel.length > 2 && currentRSRP > stateLevel[2]) {
            icon = CellPhoneIconPoor[Number(isCurrentRSRPMax)];
          } else if (stateLevel.length > 3 && currentRSRP > stateLevel[3]) {
            // eslint-disable-next-line prefer-destructuring
            icon = CellPhoneIconWorst[0];
          }

          // UE highlighting
          const accHighlight = () => {
            const acc = []; // available cell-line candidates
            ur.UECellReports.forEach((uecr) => {
              acc.push(
                <Polyline
                  key={`acc-${ur.IMSI}-${uecr.NCGI}`}
                  positions={[
                    [ur.latitude, ur.longitude],
                    [
                      report.cellReports.find((cr) => cr.NCGI === uecr.NCGI).latitude,
                      report.cellReports.find((cr) => cr.NCGI === uecr.NCGI).longitude,
                    ],
                  ]}
                  color={uecr.NCGI === ur.associatedNCGI ? 'var(--theme-ui-colors-ueass)' : 'var(--theme-ui-colors-unass)'}
                  weight={2}
                  opacity={1}
                  smoothFactor={1}
                  dashArray={uecr.NCGI === ur.associatedNCGI ? undefined : [5, 5]}
                />,
              );
            });
            setAvabCellLines(acc);
          };
          if (ur.IMSI === avabCellTargetUE) {
            accHighlight();
          }

          // UE position
          upc.push(
            <Marker
              key={`upc-${ur.IMSI}`}
              icon={icon}
              position={[ur.latitude, ur.longitude]}
              eventHandlers={{
                click: () => {
                  clearTimeout(avabCellLinesDisappearTimeout);
                  avabCellTargetUE = ur.IMSI;
                  accHighlight();
                  avabCellLinesDisappearTimeout = setTimeout(() => {
                    setAvabCellLines([]);
                    avabCellTargetUE = '';
                  }, 5000) as unknown as number;
                },
              }}
            >
              <Tooltip opacity={0.7} direction="bottom">
                <b>{`[${ur.IMSI}]`}</b>
                <br />
                <span>Connected to&nbsp;:&nbsp;</span>
                <span>{ur.associatedNCGI}</span>
                &nbsp;(
                <span>{currentRSRP}</span>
                {isCurrentRSRPMax ? ' ← MAX' : ''}
                )
                {
                  !isCurrentRSRPMax ? (
                    <>
                      <br />
                      <span>Highest&nbsp;RSRP&nbsp;:&nbsp;</span>
                      <span>{highestNCGI}</span>
                      &nbsp;(
                      <span>{highestRSRP}</span>
                      )
                    </>
                  ) : null
                }
                <br />
                <b>Visible Cells&nbsp;:&nbsp;</b>
                <span>
                  {ur.UECellReports.map((uecr) => `${getCellLabel(uecr.NCGI)}`).join(', ')}
                </span>
              </Tooltip>
            </Marker>,
          );

          // Association line
          alc.push(
            <Polyline
              key={`alc-${ur.IMSI}`}
              positions={[
                [ur.latitude, ur.longitude],
                [
                  report.cellReports.find((cr) => cr.NCGI === ur.associatedNCGI).latitude,
                  report.cellReports.find((cr) => cr.NCGI === ur.associatedNCGI).longitude,
                ],
              ]}
              color="var(--theme-ui-colors-assli)"
              weight={2}
              opacity={0.5}
              smoothFactor={1}
            />,
          );
        });

        if (!floatingState.mapFlied && floatingState.map) {
          const center: LatLngTuple = [
            cellCenter[0] / report.cellReports.length,
            cellCenter[1] / report.cellReports.length,
          ];
          floatingState.mapFlied = true;
          if ((process.env.NEXT_PUBLIC_WANNA_FLY || 'true') === 'true') {
            floatingState.map.flyTo(center, 9.8);
            log.info(`Flied map into the initial center: ${center}`);
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
          } else {
            floatingState.map.setView(center, 9.8);
            log.info(`Moved map into the initial center: ${center}`);
            toast.success(
              <div>
                <b>
                  Welcome&nbsp;to&nbsp;the&nbsp;
                  <Heading as="span">Roadshow</Heading>
                  !
                </b>
                <br />
                <span>
                  Automatically moved to the center of visible cells.
                </span>
              </div>,
              {
                autoClose: 10000,
              },
            );
          }
          toast.info(
            <div>
              <b>Initial&nbsp;Statistics</b>
              <br />
              <span>
                UE&nbsp;×&nbsp;
                {report.UEReports.length}
              </span>
              &nbsp;/&nbsp;
              <span>
                Cell&nbsp;×&nbsp;
                {report.cellReports.length}
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
        setCellLabels(clc);
        setAssocLines(alc);
      }).catch((e: Error) => {
        log.error(e);
        toast.error(
          <div>
            <b>
              Error&nbsp;:&nbsp;
              {e.name}
            </b>
            <br />
            <span>
              {e.message}
            </span>
          </div>,
        );
      });
    }, Number.parseInt(process.env.NEXT_PUBLIC_UPDATE_INTERVAL, 10) || 1000);
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
            <LayersControl.Overlay checked name="Association lines">
              <LayerGroup>
                {assocLines}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Highlighted lines">
              <LayerGroup>
                {avabCellLines}
              </LayerGroup>
              <LayerGroup>
                {connUELines}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Cell ranges">
              <LayerGroup>
                {cellRanges}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Cell centers">
              <LayerGroup>
                {cellCenters}
              </LayerGroup>
              <LayerGroup>
                {cellLabels}
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
