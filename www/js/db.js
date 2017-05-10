(function(eko, $, undefined) {
	eko.database = (function() {
		
	var MODULE_ID="DatabaseModule"
	var db = null;
	console.log("DATBASE MODULE PRESTART");
	
	document.addEventListener('deviceready', function() {
		db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
		console.log(MODULE_ID + " init start");
		initDatabase();
		console.log(MODULE_ID + " init end");
	});

	initDatabase = function() {
	
	
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS Predavanje (id INTEGER PRIMARY KEY AUTOINCREMENT, remoteId INTEGER, name Text, surname TEXT, nameSurane TEXT, firm TEXT, picId INT, description TEXT)');
    
			}, function(error) {
				console.error(MODULE_ID + " " + "Transaction ERROR: " + error.message);
			}, function() {
				console.log(MODULE_ID + " " + "Database init ok" );
			});
	}
		
	
	uploadPredavanjeDataToDatabase=function(data) 
	{
	
		if(data==null || data.length==0)
		{
			console.log(MODULE_ID +'uploadPredavanjeDataToDatabase data missing ');
			return;
		}
			console.log(MODULE_ID +'uploadPredavanjeDataToDatabase data size ' + data.length);
		var current;
		for(var i=0;i<data.length;i++)
		{
			current=data[i];
			db.executeSql('INSERT INTO Predavanje(remoteId,name,surname,nameSurane,firm,picId,description) VALUES (?,?,?,?,?,?,?)', [data.id, data.ime, data.prezime, data.imePrezime, data.poduzece, data.slikaId, data.opis], function (resultSet) {
		
				console.log(MODULE_ID +'uploadPredavanjeDataToDatabase resultSet.insertId: ' + resultSet.insertId);
				console.log(MODULE_ID +'uploadPredavanjeDataToDatabase resultSet.rowsAffected: ' + resultSet.rowsAffected);
		
			}, function(error) {
			console.error(MODULE_ID +'uploadPredavanjeDataToDatabase error: ' + error.message);
			});
		
		}
	
	
		
	
	
	}
	
		return {
		    uploadPredavanjeDataToDatabase : uploadPredavanjeDataToDatabase,
		
		};
	})();
}(window.eko = window.eko || {}, jQuery));