Template.registerHelper("print", function (first, second, third, fourth) {
  if (first === undefined || second === undefined) {
    console.log("No arguments given to global print helper :(");
  } else if (third === undefined) {
    console.log(first);
  } else if (fourth === undefined) {
    console.log(first, second);
  } else {
    console.log("the current print helper only does 2 arguments...");
  }
});

Template.registerHelper('compare', function (first, second) {
  if (typeof first === 'object' && typeof second === 'object') {
    return _.isEqual(first, second); // do a object comparison
  } else {
    return first === second;
  }
});

Template.registerHelper('count', function (first) {
  return first.count();
});
