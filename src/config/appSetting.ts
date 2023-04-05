import type { AppSetting } from "../models/appSetting";
declare global {
  interface Window {
    dynamic_configuration: any;
  }
}
const config = window.dynamic_configuration;
export const appSetting: AppSetting = config;
