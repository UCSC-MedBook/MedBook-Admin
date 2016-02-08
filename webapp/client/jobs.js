// Template.uploadNewFiles

// defined out here because it's to be _.partial-ed per instance
function blobsInsertCallback (jobName, error, fileObject) {
  if (error) {
    console.log("error:", error);
  } else {
    Jobs.insert({
      name: jobName,
      user_id: Meteor.userId(),
      args: {
        blob_id: fileObject._id,
        blob_name: fileObject.original.name,
      },
      status: "creating",
    });
  }
}

Template.uploadNewFiles.onCreated(function () {
  var instance = this;

  instance.blobsInsertCallback = _.partial(blobsInsertCallback,
      instance.data);
});

// NOTE: this is puleld almost directly from Wrangler
Template.uploadNewFiles.events({
  // when they actually select a file
  "change .upload-files-input": function (event, instance) {
    event.preventDefault();

    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
      var newFile = new FS.File(files[i]);
      newFile.metadata = {
        user_id: Meteor.userId(),
        uploaded: true,
      };

      // insertion is supposed to happen on the client
      Blobs.insert(newFile, instance.blobsInsertCallback);
    }
  },
  // add a URL from tbe web
  "submit form.add-from-web": function (event, instance) {
    event.preventDefault();

    var urlInput = event.target.urlInput;
    if (urlInput.value) {
      // https://github.com/CollectionFS/Meteor-CollectionFS/
      // wiki/Insert-One-File-From-a-Remote-URL
      var newFile = new FS.File();
      newFile.attachData(urlInput.value, function (error) {
        if (error) {
          throw error;
        } else {
          newFile.metadata = {
            "user_id": Meteor.userId(),
            "uploaded": true,
          };
          Blobs.insert(newFile, instance.blobsInsertCallback);
          urlInput.value = "";
        }
      });
    }
  },
});

// Template.jobsTable

Template.jobsTable.onCreated(function () {
  var instance = this;

  instance.subscribe("jobsByName", instance.data);
});

Template.jobsTable.helpers({
  getJobs: function () {
    return Jobs.find({
      name: Template.instance().data,
    }, {
      sort: { date_created: -1 }
    });
  },
});

// Template.jobRow

Template.jobRow.onCreated(function () {
  var instance = this;

  instance.subscribe("specificBlob", instance.data.args.blob_id);
});

Template.jobRow.helpers({
  sinceDate: function () {
    // TODO: make this refresh every now and then
    return moment(this.date_created).fromNow();
  },
  waitingOrCreating: function () {
    return this.status === "waiting" || this.status === "creating";
  },
  stackTraceLines: function () {
    return this.stack_trace.split("\n");
  },
  blobStored: function () {
    // TODO: add this to the Meteor method starting the job run
    var blob = Blobs.findOne(this.args.blob_id);
    if (blob) {
      return blob.hasStored("blobs");
    }
  },
  errorOrDone: function () {
    return this.status === "done" || this.status === "error";
  },
});

Template.jobRow.events({
  "click .run-job": function (event, instance) {
    Jobs.update(instance.data._id, {
      $set: {
        status: "waiting",
      }
    });
  },
  "click .delete-job": function (event, instance) {
    Jobs.remove(instance.data._id);
  },
  "click .cancel-job": function (event, instance) {
    Jobs.update(instance.data._id, {
      $set: {
        status: "creating",
      }
    });
  },
  "click .rerun-job": function (event, instance) {
    Jobs.insert({
      name: instance.data.name,
      user_id: Meteor.userId(),
      args: instance.data.args,
      status: "creating",
    });
  },
});

// Template.jobsHelp

Template.jobsHelp.helpers({
  getJobsHelp: function () {
    return [
      {
        name: "ParseWranglerFile",
        help: "Sets options in an uploaded file and tries to parse it for summary data",
      },
      {
        name: "SubmitWranglerFile",
        help: "Parses and writes a file into the database",
      },
      {
        name: "SubmitWranglerSubmission",
        help: "Verifies options and lines up each wrangler file to be " +
            "written into the database",
      },
      {
        name: "FinishWranglerSubmission",
        help: "Sets the status of a submission after all of the files have " +
            "been parsed and written into the database.",
      },
      {
        name: "RunLimma",
        help: "Runs limma",
      },
    ];
  },
});
