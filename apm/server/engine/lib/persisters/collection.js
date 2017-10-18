module.exports = function(collectionName, db) {
  return function(app, data, callback) {
    db.collection(collectionName).insert(data, function(err, result) {
      if (err) {
        //todo: do the error handling and re-try logic
        console.log(
          'error when inserting to collection: ',
          collectionName,
          ' - error: ',
          err.toString()
        );
      }
      if (callback) callback(err);
    });
  };
};
