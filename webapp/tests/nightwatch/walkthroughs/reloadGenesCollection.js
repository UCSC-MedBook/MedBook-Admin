module.exports = {
  "Reload genes collection": function (client) {
    client
      .url("http://localhost:3000/Admin")
      .resizeWindow(1024, 768).pause(1000)
      .reviewMainLayout()
    ;

    // make sure user exists and log in
    client
      .timeoutsAsyncScript(1000)
      .executeAsync(function(data, done){
        Accounts.createUser({
          email: 'admin@medbook.ucsc.edu',
          password: 'testing',
          profile: {
            collaborations: ['testing', 'admin']
          }
        }, done);
      })
      .executeAsync(function(data, done) {
        Meteor.logout(done);
      })
      .signIn("admin@medbook.ucsc.edu", "testing")
    ;



    // Add a gene file, add it
    var urlInput = "form#add-from-web-form input[name='urlInput']";
    client
      .waitForElementVisible("#reload-genes-collection.panel", 2000)
      .verify.elementPresent("#reload-genes-collection.panel")
      .verify.elementPresent("#reload-genes-collection .well.insert-file-well")
        .verify.elementPresent("#reload-genes-collection .insert-file-button input[type=file]") // left button
        // right button
        .assert.elementPresent('#reload-genes-collection .insert-file-button input[name="urlInput"]')
        .assert.elementPresent("#reload-genes-collection .insert-file-button #add-from-web-form")
    ;


    client
      .assert.elementNotPresent('#reload-genes-collection .delete-job')
      .clearValue(urlInput)
      .setValue(urlInput, "http://localhost:3000/HGNC_first_100.tsv")
      .click("#reload-genes-collection #add-from-web-form button[type='submit']")
      .waitForElementVisible("button.run-job", 1000)
      .verify.value(urlInput, "")
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > th", "creating")
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(2)", "a few seconds ago")
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(3)", "HGNC_first_100.tsv")
      .verify.elementPresent("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job")
      .verify.elementPresent("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.delete-job")

      // delete it and add it again
      .click("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.delete-job")
      .verify.elementNotPresent("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job")
      .clearValue(urlInput)
      .setValue(urlInput, "http://localhost:3000/HGNC_first_100.tsv")
      .click("#reload-genes-collection #add-from-web-form button[type='submit']")
      .waitForElementVisible("button.run-job", 1000)

      // run the job
      .click("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job")
      .waitForElementNotPresent("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job", 500)
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > th", "waiting")
      .verify.elementPresent("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.delete-job")

      .waitForElementVisible("#reload-genes-collection tbody > tr:nth-child(1) > th.done", 10000)
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4)", "Genes created: 15")

    ;

    client.end();
  },
};
