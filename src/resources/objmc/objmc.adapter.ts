import { Injectable } from "@nestjs/common";
import { ObjmcConfigState } from "../../types/ObjmcConfigState";
import { ObjmcConfig } from "../../types/ObjmcConfig";


@Injectable()
export class ObjmcAdapter {
  configStateToConfig(configState: ObjmcConfigState): ObjmcConfig {
    return {
      scale: configState.options.scale,
      offset: [configState.options.offset.x, configState.options.offset.y, configState.options.offset.z],
      duration: configState.animation.duration,
      easing: () => {
        switch (configState.animation.positionEasing) {
          case "none":
            return 0
          case "linear":
            return 1
          case "cubic":
            return 2
          case "bezier":
            return 3
        }
      },
      interpolation: () => {
        switch (configState.animation.textureInterpolation) {
          case "none":
            return 0
          case "linear":
            return 1
        }
      },
      colorbehavior: [
        configState.animation.colorBehavior["1"],
        configState.animation.colorBehavior["2"],
        configState.animation.colorBehavior["3"],
      ],
      autorotate: () => {
        switch (configState.options.autoRotate) {
          case "off":
            return 0
          case "yaw":
            return 1
          case "pitch":
            return 2
          case "both":
            return 3
        }
      },
      autoplay: configState.animation.autoPlay,
      flipuv: configState.options.flipuv,
      noshadow: configState.options.noShadow,
      nopow: configState.options.nopow,
      visibility: configState.options.visibilty,
      png_output: configState.output.png,
      json_output: configState.output.json
    }
  }
}