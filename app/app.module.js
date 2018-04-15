angular
  .module('app', [
    'ngMaterial',
    'angularResizable',
    'ui.codemirror',
    'indexedDB',
    'app.routes',
    'app.directives',
    'app.controllers',
    'app.services'
  ])
  .config(function ($indexedDBProvider) {
    $indexedDBProvider
      .connection('myIndexedDB')
      .upgradeDatabase(1, function(event, db, tx){
        var objStore = db.createObjectStore('messages', {keyPath: 'id', "autoIncrement": true});
        objStore.createIndex('id', 'id', {unique: true});
      });
  });
