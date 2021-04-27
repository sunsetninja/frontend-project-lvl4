// @ts-check

const host = "";
const prefix = "api/v1";

export default {
  login: () => [host, prefix, "login"].join("/"),
  signup: () => [host, prefix, "signup"].join("/"),
  dataPath: () => [host, prefix, "data"].join("/"),
  channelsPath: () => [host, prefix, "channels"].join("/"),
  channelPath: (id) => [host, prefix, "channels", id].join("/"),
};
