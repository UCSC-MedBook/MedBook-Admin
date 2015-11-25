Meteor.publish("jobsByName", function (name) {
  return Jobs.find({
    name: name
  });
});

Meteor.publish("specificBlob", function (blob_id) {
  // TODO: add security
  return Blobs.find(blob_id);
});
