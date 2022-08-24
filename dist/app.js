"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mysql_1 = __importDefault(require("mysql"));
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
// Create connection to database
var connectionString = process.env.DATABASE_URL || '';
var connection = mysql_1.default.createConnection(connectionString);
connection.connect();
app.get('/api/characters', function (req, res) {
    // Create query String
    var query = 'SELECT * FROM characters';
    connection.query(query, function (err, rows) {
        if (err)
            throw err;
        var returnValue = {
            data: rows,
            message: rows.length === 0 ? 'No records found' : null,
        };
        return res.send(returnValue);
        // TO connect from terminal pscale connect tog dev --execute 'npm run dev'
    });
});
app.get('/api/characters/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM characters WHERE ID = ".concat(id, " LIMIT 1");
    connection.query(query, function (err, rows) {
        if (err)
            throw err;
        var returnValue = {
            data: rows.length > 0 ? rows[0] : null,
            message: rows.length === 0 ? 'No Record Found' : null,
        };
        return res.send(returnValue);
        // TO connect from terminal pscale connect tog dev --execute 'npm run dev'
    });
});
app.listen(port, function () {
    console.log("Server running on port: ".concat(port));
});
//# sourceMappingURL=app.js.map