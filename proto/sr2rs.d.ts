declare module 'sr2rs' {
  const StatReport: {
    readonly cellReports: {
      readonly NCGI: string;
      readonly load: number;
      readonly longitude: number;
      readonly latitude: number;
      readonly txPowerDB: number;
    }[];
    readonly UEReports: {
      readonly IMSI: string;
      readonly associatedNCGI: string;
      readonly longitude: number;
      readonly latitude: number;
      readonly UECellReports: {
        readonly NCGI: string;
        readonly RSRP: number;
      }[];
      readonly isRRCIdle: boolean;
      readonly routeLongitudes: number[];
      readonly routeLatitudes: number[];
      readonly routeNextPoint: string;
      readonly isRouteReversed: boolean;
    }[];
  };
  export default StatReport;
}
