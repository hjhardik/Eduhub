//dbPassword = 'mongodb+srv://YOUR_USERNAME_HERE:'+ encodeURIComponent('YOUR_PASSWORD_HERE') + '@CLUSTER_NAME_HERE.mongodb.net/test?retryWrites=true';
dbPassword =
  "mongodb+srv://hardik:hjhardik@cluster0.vsi2m.mongodb.net/<dbname>?retryWrites=true&w=majority";
trackingId = "UA-171409849-1";
apiClientId = "5236c1439e15412a9ce423f4a606d16a";

module.exports = {
  mongoURI: dbPassword,
  TRACKING_ID: trackingId,
  API_CLIENT_ID: apiClientId,
};
