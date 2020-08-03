import { checkDeviceConnected } from "./pubsub";
import Device from "../models/device";

const checkDevicesConnected = async () => {
  const device = await Device.find({});
  const deviceIds = device.map(d => d._id);
  checkDeviceConnected(deviceIds);
};

export default checkDevicesConnected;
