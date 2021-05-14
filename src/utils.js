export default {
  parseNodeConfig(nodeConfig) {
    return `${(location.protocol=='https:')?nodeConfig.sslProtocol:nodeConfig.protocol}://${nodeConfig.hostname}${
      (location.protocol=='https:') ? "" : (nodeConfig.port ? ":" + nodeConfig.port : "")
    }`;
  },
};
