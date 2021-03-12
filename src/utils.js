export default {
  parseNodeConfig(nodeConfig) {
    return `${nodeConfig.protocol}://${nodeConfig.hostname}${
      nodeConfig.port ? ":" + nodeConfig.port : ""
    }`;
  },
};
