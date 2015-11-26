Meteor.publish("jobsByName", function (name) {
  return Jobs.find({
    name: name
  });
});

Meteor.publish("specificBlob", function (blob_id) {
  // TODO: add security
  return Blobs.find(blob_id);
});

Meteor.publish('genesTesting', function (options) {
  var user = Meteor.users.findOne(this.userId);

  if (user.profile.collaborations.indexOf('testing') !== -1) {
    return Genes.find({}, options);
  }

  this.ready();
});
