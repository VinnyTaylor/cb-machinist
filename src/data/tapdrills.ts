export interface TapDrill {
  thread: string;
  tpi: number;
  tapDrill: string;
  decimalSize: number;
  percentThread: number;
}

export const tapDrills: TapDrill[] = [
  { thread: '#4-40', tpi: 40, tapDrill: '#43', decimalSize: 0.089, percentThread: 75 },
  { thread: '#6-32', tpi: 32, tapDrill: '#36', decimalSize: 0.1065, percentThread: 75 },
  { thread: '#8-32', tpi: 32, tapDrill: '#29', decimalSize: 0.136, percentThread: 75 },
  { thread: '#10-24', tpi: 24, tapDrill: '#25', decimalSize: 0.1495, percentThread: 75 },
  { thread: '#10-32', tpi: 32, tapDrill: '#21', decimalSize: 0.159, percentThread: 75 },
  { thread: '1/4-20', tpi: 20, tapDrill: '#7', decimalSize: 0.201, percentThread: 75 },
  { thread: '1/4-28', tpi: 28, tapDrill: '#3', decimalSize: 0.213, percentThread: 75 },
  { thread: '5/16-18', tpi: 18, tapDrill: 'F', decimalSize: 0.257, percentThread: 75 },
  { thread: '5/16-24', tpi: 24, tapDrill: 'I', decimalSize: 0.272, percentThread: 75 },
  { thread: '3/8-16', tpi: 16, tapDrill: '5/16', decimalSize: 0.3125, percentThread: 75 },
  { thread: '3/8-24', tpi: 24, tapDrill: 'Q', decimalSize: 0.332, percentThread: 75 },
  { thread: '7/16-14', tpi: 14, tapDrill: 'U', decimalSize: 0.368, percentThread: 75 },
  { thread: '7/16-20', tpi: 20, tapDrill: '25/64', decimalSize: 0.3906, percentThread: 75 },
  { thread: '1/2-13', tpi: 13, tapDrill: '27/64', decimalSize: 0.4219, percentThread: 75 },
  { thread: '1/2-20', tpi: 20, tapDrill: '29/64', decimalSize: 0.4531, percentThread: 75 },
  { thread: '9/16-12', tpi: 12, tapDrill: '31/64', decimalSize: 0.4844, percentThread: 75 },
  { thread: '9/16-18', tpi: 18, tapDrill: '33/64', decimalSize: 0.5156, percentThread: 75 },
  { thread: '5/8-11', tpi: 11, tapDrill: '17/32', decimalSize: 0.5312, percentThread: 75 },
  { thread: '5/8-18', tpi: 18, tapDrill: '37/64', decimalSize: 0.5781, percentThread: 75 },
  { thread: '3/4-10', tpi: 10, tapDrill: '21/32', decimalSize: 0.6562, percentThread: 75 },
  { thread: '3/4-16', tpi: 16, tapDrill: '11/16', decimalSize: 0.6875, percentThread: 75 },
  { thread: '7/8-9', tpi: 9, tapDrill: '49/64', decimalSize: 0.7656, percentThread: 75 },
  { thread: '1"-8', tpi: 8, tapDrill: '7/8', decimalSize: 0.875, percentThread: 75 }
];
