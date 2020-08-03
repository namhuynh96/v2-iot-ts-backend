import awsIot from "aws-iot-device-sdk";
import keys from "../config/keys";

const checkDeviceConnected = (deviceIds: string | string[]) => {
  const device = new awsIot.device({
    host: keys.awsIotEndpoint,
    protocol: "wss",
    accessKeyId: keys.awsAccessKeyId,
    secretKey: keys.awsSecretKey
  });
  const topics: string[] = [];
  if (Array.isArray(deviceIds)) {
    deviceIds.forEach(id => {
      topics.push(
        `$aws/events/presence/connected/${id}`,
        `$aws/events/presence/disconnected/${id}`
      );
    });
  } else if (typeof deviceIds === "string") {
    topics.push(
      `$aws/events/presence/connected/${deviceIds}`,
      `$aws/events/presence/disconnected/${deviceIds}`
    );
  }
  device.subscribe(topics);

  device.on("message", function(_topic, payload) {
    const data = JSON.parse(payload.toString());
    device.publish(
      `$aws/things/${data.clientId}/shadow/update`,
      JSON.stringify({
        state: {
          reported: {
            connected: data.eventType === "connected" ? true : false
          }
        }
      })
    );
  });
};

// const uncheckDeviceConnected = deviceIds => {
//   const topics = [];
//   if (Array.isArray(deviceIds)) {
//     deviceIds.forEach(id => {
//       topics.push(
//         `$aws/events/presence/connected/${id}`,
//         `$aws/events/presence/disconnected/${id}`
//       );
//     });
//   } else if (typeof deviceIds === "string") {
//     topics.push(
//       `$aws/events/presence/connected/${deviceIds}`,
//       `$aws/events/presence/disconnected/${deviceIds}`
//     );
//   }
//   device.unsubscribe(topics);
// };

export { checkDeviceConnected };
