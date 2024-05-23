
export type Experiment = {
  id:          number;
  title:       string;
  description: string;
  tests:       Test[];
}

export type Test = {
  id:             number;
  title:          string;
  endTime:        string;
  endTimeHours:   string;
  endTimeMinutes: string;
  instructions:   TestInstructions[];
  testDates:      TestDate[];
}

export type TestInstructions = {
  id?:              Test['id'];
  startTime:        string;
  startTimeHours:   string;
  startTimeMinutes: string;
  iceTempBigLane:   number;
  iceTempSmallLane: number;
  glycolTemp:       number;
  // setFlowPump?:     number;
}

export type TestDate = {
  id:   number;
  date: string;
  // TODO: Add types for measurement and power usage
  powerUsage?:  unknown[],
  measurement?: unknown[],
}