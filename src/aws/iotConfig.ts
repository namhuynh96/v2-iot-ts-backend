import AWS from "aws-sdk";

AWS.config.apiVersion = "2015-05-28";

const iot = new AWS.Iot({ region: "eu-central-1" });

export default iot;
