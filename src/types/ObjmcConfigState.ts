export interface ObjmcConfigState {
  options: {
    offset: {
      x: string,
      y: string,
      z: string,
    },
    scale: string,
    noShadow: boolean,
    autoRotate: 'off' | 'yaw' | 'pitch' | 'both',
    flipuv?: boolean,
    nopow: boolean,
    visibilty: number
  },
  animation: {
    duration: string,
    positionEasing: 'none' | 'linear' | 'cubic' | 'bezier',
    textureInterpolation: 'none' | 'linear',
    autoPlay: boolean,
    colorBehavior: {
      1: 'pitch' | 'yaw' | 'roll',
      2: 'pitch' | 'yaw' | 'roll',
      3: 'pitch' | 'yaw' | 'roll'
    },
  },
  output: {
    json?: string,
    png?: string,
  }
}
