export interface FlutterwaveConfig {
  secretKey: string;
}

export interface FlutterWaveResponse<T> {
  status: string;
  message: string;
  data: T;
}
