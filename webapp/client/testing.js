// Template.genesTesting

Template.genesTesting.onCreated(function () {
  var instance = this;

  instance.options = {
    sort: { gene_label: 1 },
    limit: 100,
  };
  instance.subscribe('genesTesting', instance.options);
});

Template.genesTesting.helpers({
  getGenes: function () {
    return Genes.find({}, Template.instance().options);
  },
  checkUndefined: function (text) {
    if (text === undefined) {
      return 'undefined';
    }
    return text;
  },
});