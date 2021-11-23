/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Polyline, PolylineProps } from 'react-leaflet';
import { Polyline as LeafletPolyline } from 'leaflet';
import { LineString, MultiLineString } from 'geojson';
import 'leaflet-arrowheads';

type Props = PolylineProps & {
  arrowheads?: object;
  children?: React.ReactNode;
};

class ArrowheadsPolyline extends React.Component<Props> {
  polylineRef: LeafletPolyline<LineString | MultiLineString, any>;

  componentDidMount() {
    const { arrowheads } = this.props;
    const polyline = this.polylineRef;
    if (arrowheads) {
      // @ts-ignore
      polyline.arrowheads(arrowheads);
      // @ts-ignore
      polyline._update();
    }
  }

  componentWillUnmount() {
    const { arrowheads } = this.props;
    if (arrowheads) {
      const polyline = this.polylineRef;
      // @ts-ignore
      polyline.deleteArrowheads();
    }
  }

  render() {
    const { children } = this.props;
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Polyline {...this.props} ref={(polylineRef) => { this.polylineRef = polylineRef; }}>
        {children}
      </Polyline>
    );
  }
}

export default ArrowheadsPolyline;
