Meteor.methods({
  addJob: function (job) {
    console.log("need to validate user is in admin collection");
    Jobs.insert(job);
  },
});
