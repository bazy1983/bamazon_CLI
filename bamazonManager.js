var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var table = new Table({
    head: ['ID', 'Name', "Price", "Quantity"]
    , colWidths: [10, 20, 10, 10]
});
var items = []; //used to validate against user input

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "07702535961Mm",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;

    askManager()
})

function viewStore() {
    connection.query("SELECT * FROM products", function (err, res) { //show all products if stock is higher than zero
        res.forEach(element => {
            items.push(element.item_id)
            table.push([element.item_id, element.product_name, `$${element.price}.00`, element.stock_quantity])
        });
        console.log(table.toString());
        askManager();
    })
}

function askManager(res) {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all products", "View low inventory", "Add to inventory", "Add new product", "Quit"]
        }
    ])
        .then(function (answer) {
            switch (answer.options) {
                case "View all products":
                    viewStore();
                    break;
                default:
                    connection.end(function (err) {
                        console.log("Connection to the app ended")
                    })
            }
        })
}