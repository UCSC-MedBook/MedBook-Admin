module.exports = {
  "Reload genes collection": function (client) {
    client
      .url("http://localhost:3000/Admin")
      .resizeWindow(1024, 768).pause(2000)
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
            collaborations: ['testing', 'Admin']
          }
        }, done);
      })
      .executeAsync(function(data, done) {
        Meteor.logout(done);
      })
      .signIn("admin@medbook.ucsc.edu", "testing")
    ;

    // Make sure some basic stuff is there
    client
      .waitForElementVisible("#reload-genes-collection.panel", 2000)
      .verify.elementPresent("#reload-genes-collection.panel")
      .verify.elementPresent("#reload-genes-collection .well.insert-file-well")
        .verify.elementPresent("#reload-genes-collection .insert-file-button input[type=file]") // left button
        // right button
        .assert.elementPresent('#reload-genes-collection .insert-file-button input[name="urlInput"]')
        .assert.elementPresent("#reload-genes-collection .insert-file-button .add-from-web")
    ;

    // check to see what happens with a missing column
    var urlInput = "#reload-genes-collection .add-from-web input[name='urlInput']";
    client
      .clearValue(urlInput)
      .setValue(urlInput, "http://localhost:3000/HGNC_missing_column.tsv")
      .click("#reload-genes-collection .add-from-web button[type='submit']")
      .waitForElementVisible("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job", 10000)
      .click("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job")
      .waitForElementPresent("#reload-genes-collection tbody > tr:nth-child(1) > th.error", 20000)
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > th", "error")
      .verify.containsText("#reload-genes-collection > table > tbody > tr:nth-child(1) > td:nth-child(4)", "Stack trace")
    ;

    // add a valid file, delete it, add it again, run the job to insert
    client
      .assert.elementNotPresent('#reload-genes-collection .delete-job')
      .clearValue(urlInput)
      .setValue(urlInput, "http://localhost:3000/HGNC_first_100.tsv")
      .click("#reload-genes-collection .add-from-web button[type='submit']")
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
      .click("#reload-genes-collection .add-from-web button[type='submit']")
      .waitForElementVisible("button.run-job", 1000)

      // run the job
      .click("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job")
      .waitForElementNotPresent("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.run-job", 500)
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > th", "waiting")
      .verify.elementPresent("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4) > button.cancel-job")

      .waitForElementVisible("#reload-genes-collection tbody > tr:nth-child(1) > th.done", 20000)
      .verify.containsText("#reload-genes-collection tbody > tr:nth-child(1) > td:nth-child(4)", "Genes created: 79")

      // make sure the data are there
      .url('http://localhost:3000/Admin/testing/genesTesting')
      .waitForElementVisible('#data > table > tbody > tr:nth-child(79)', 5000)
      .reviewGenes(1, {
          "gene_label" : "A1BG",
          "gene_name" : "alpha-1-B glycoprotein",
          "chromosome" : "19q13.43",
          locus_type: "gene with protein product",
          locus_group: "protein-coding gene",
          "hgnc_id" : "HGNC:5"
      })
      .reviewGenes(2, {
        "gene_label" : "A1BG-AS1",
        "gene_name" : "A1BG antisense RNA 1",
        "previous_names" : [
          "non-protein coding RNA 181",
          "A1BG antisense RNA (non-protein coding)",
          "A1BG antisense RNA 1 (non-protein coding)"
        ],
        "previous_labels" : [
          "NCRNA00181",
          "A1BGAS",
          "A1BG-AS"
        ],
        "synonym_labels" : [
          "FLJ23569"
        ],
        "chromosome" : "19q13.43",
        locus_type: "RNA, long non-coding",
        locus_group: "non-coding RNA",
        "hgnc_id" : "HGNC:37133"
      })
      .reviewGenes(10, {
        "gene_label" : "A3GALT2",
        "gene_name" : "alpha 1,3-galactosyltransferase 2",
        "previous_names" : [
            "alpha 1,3-galactosyltransferase 2, pseudogene"
        ],
        "previous_labels" : [
            "A3GALT2P"
        ],
        "synonym_labels" : [
            "IGBS3S",
            "IGB3S"
        ],
        "synonym_names" : [
            "iGb3 synthase",
            "isoglobotriaosylceramide synthase"
        ],
        "chromosome" : "1p35.1",
        locus_type: "gene with protein product",
        locus_group: "protein-coding gene",
        "hgnc_id" : "HGNC:30005"
      })
      .reviewGenes(62, {
        "gene_label" : "ABCB10P1",
        "gene_name" : "ATP binding cassette subfamily B member 10 pseudogene 1",
        "previous_names" : [
          "ATP-binding cassette, sub-family B (MDR/TAP), member 10 pseudogene",
          "ATP-binding cassette, sub-family B (MDR/TAP), member 10 pseudogene 2",
          "ATP-binding cassette, sub-family B (MDR/TAP), member 10 pseudogene 1"
        ],
        "previous_labels" : [
          "ABCB10P",
          "ABCB10P2"
        ],
        "synonym_labels" : [
          "M-ABC2",
          "MABC2"
        ],
        "chromosome" : "15q11.2",
        locus_type: "pseudogene",
        locus_group: "pseudogene",
        "hgnc_id" : "HGNC:14114"
      })
      .verify.elementNotPresent('#data > table > tbody > tr:nth-child(80)')
    ;

    // add a transcript mapping file, run it, then check the output
    urlInput = "#add-transcript-mapping .add-from-web input[name='urlInput']";
    client
      .url("http://localhost:3000/Admin")
      .waitForElementVisible(urlInput, 1000)
      .clearValue(urlInput)
      .setValue(urlInput, "http://localhost:3000/transcript_mappings.tsv")
      .click("#add-transcript-mapping .add-from-web button[type='submit']")
      .waitForElementVisible("button.run-job", 1000)
      .click("button.run-job")
      .waitForElementVisible("#add-transcript-mapping tbody > tr:nth-child(1) > th.done", 20000) // wait to be done
      .verify.containsText("#add-transcript-mapping tbody > tr:nth-child(1) > td:nth-child(4)", "Transcripts mapped: 6")
      .verify.containsText("#add-transcript-mapping tbody > tr:nth-child(1) > td:nth-child(4)", "Transcripts unable to map (genes don't exist): 2")

      // make sure the data's there
      .url('http://localhost:3000/Admin/testing/genesTesting')
      .waitForElementVisible("#data > table > tbody > tr:nth-child(79)", 5000)
      .pause(1000)
      .reviewGenes(1, {
        "gene_label" : "A1BG",
        "gene_name" : "alpha-1-B glycoprotein",
        "chromosome" : "19q13.43",
        "locus_type" : "gene with protein product",
        "locus_group" : "protein-coding gene",
        "hgnc_id" : "HGNC:5",
        "status" : "Approved",
        "gene" : "A1BG",
        "transcripts" : "[uc002qsd.4],[uc002qsf.2]" // NOTE: after transformation
      })
      .reviewGenes(62, {
        "gene_label" : "ABCB10P1",
        "gene_name" : "ATP binding cassette subfamily B member 10 pseudogene 1",
        "previous_names" : [
          "ATP-binding cassette, sub-family B (MDR/TAP), member 10 pseudogene",
          "ATP-binding cassette, sub-family B (MDR/TAP), member 10 pseudogene 2",
          "ATP-binding cassette, sub-family B (MDR/TAP), member 10 pseudogene 1"
        ],
        "previous_labels" : [
          "ABCB10P",
          "ABCB10P2"
        ],
        "synonym_labels" : [
          "M-ABC2",
          "MABC2"
        ],
        "chromosome" : "15q11.2",
        locus_type: "pseudogene",
        locus_group: "pseudogene",
        "hgnc_id" : "HGNC:14114"
      })
    ;

    client.end();
  },
};
