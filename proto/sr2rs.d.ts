declare module 'sr2rs' {
  const StatReport: {
    readonly cellReports: {
      readonly NCGI: string;
      readonly load: number;
      readonly longitude: number;
      readonly latitude: number;
      readonly txPowerDB: number;
      readonly EARFCN: number;
      readonly cellType: string;
      readonly maxUECount: string;
      readonly currentUECount: string;
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
      readonly SINR: number;
      readonly CQI: string;
      readonly mobilitySpeedAvg: number;
      readonly mobilitySpeedStdDev: number;
    }[];
  };
  export default StatReport;
}
