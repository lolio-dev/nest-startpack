export interface ObjmcConfig {
  offset?: string[];
  scale?: string;
  duration?: string;
  easing?: () => number;
  interpolation?: () => number;
  colorbehavior?: string[];
  autorotate?: () => number;
  autoplay?: boolean;
  flipuv?: boolean;
  noshadow?: boolean;
  visibility?: number;
  nopow?: boolean;
  png_output: string;
  json_output: string;
}
