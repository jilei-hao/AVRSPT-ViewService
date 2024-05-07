export default class AVRPCommonHelper {
  static getHostingURL() {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
  }
};