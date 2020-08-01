//dbPassword = 'mongodb+srv://YOUR_USERNAME_HERE:'+ encodeURIComponent('YOUR_PASSWORD_HERE') + '@CLUSTER_NAME_HERE.mongodb.net/test?retryWrites=true';
dbPassword =
  "mongodb+srv://hardik:hjhardik@cluster0.vsi2m.mongodb.net/<dbname>?retryWrites=true&w=majority";

module.exports = {
  mongoURI: dbPassword,
};
