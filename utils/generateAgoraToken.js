const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const { appId, appCertificate } = require("../config/agoraConfig");

const generateToken = (channelName, uid, role) => {
  const expireTime = 3600;

  const agoraRole =
    role === "teacher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    agoraRole,
    Math.floor(Date.now() / 1000) + expireTime
  );

  return token;
};

module.exports = generateToken;