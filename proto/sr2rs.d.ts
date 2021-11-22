declare module 'sr2rs' {
  const StatReport: {
    readonly cellReports: {
      readonly NCGI: number;
      readonly load: number;
      readonly longitude: number;
      readonly latitude: number;
      readonly txPowerDB: number;
    }[];
    readonly UEReports: {
      readonly IMSI: number;
      readonly associatedNCGI: number;
      readonly longitude: number;
      readonly latitude: number;
      readonly UECellReports: {
        readonly NCGI: number;
        readonly RSRP: number;
      }[];
      readonly isRRCIdle: boolean;
    }[];
  };
  export default StatReport;
}
