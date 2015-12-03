function tableCell(row, column) {
  return '#data > table > tbody > tr:nth-child(' + row + ') ' +
      '> td:nth-child(' + column + ')';
}

function checkUndefined(value) {
  if (value === undefined) {
    return 'undefined';
  }
  return value;
}

exports.command = function(row, doc) {
  this
    .verify.containsText(tableCell(row, 1), checkUndefined(doc.gene_label))
    .verify.containsText(tableCell(row, 2), checkUndefined(doc.gene_name))
    .verify.containsText(tableCell(row, 3), checkUndefined(doc.previous_names))
    .verify.containsText(tableCell(row, 4), checkUndefined(doc.previous_labels))
    .verify.containsText(tableCell(row, 5), checkUndefined(doc.synonym_labels))
    .verify.containsText(tableCell(row, 6), checkUndefined(doc.synonym_names))
    .verify.containsText(tableCell(row, 7), checkUndefined(doc.chromosome))
    .verify.containsText(tableCell(row, 8), checkUndefined(doc.locus_type))
    .verify.containsText(tableCell(row, 9), checkUndefined(doc.locus_group))
    .verify.containsText(tableCell(row, 10), checkUndefined(doc.hgnc_id))
  ;

  return this; // allows the command to be chained.
};
