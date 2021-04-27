export default {
  parseNodeConfig(nodeConfig) {
    console.log('Location protocol: ' + location.protocol);
    return `${(location.protocol=='https:')?nodeConfig.sslProtocol:nodeConfig.protocol}://${nodeConfig.hostname}${
      (location.protocol=='https:') ? "" : (nodeConfig.port ? ":" + nodeConfig.port : "")
    }`;
  },
};
