var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


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

function viewStore(quantity) {
    connection.query("SELECT * FROM products WHERE stock_quantity <= ?", [quantity], function (err, res) { //show all products if stock is higher than zero
        var table = new Table({
            head: ['ID', 'Name', "Price", "Quantity"]
            , colWidths: [10, 20, 10, 10]
        });
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
                    viewStore(1000); //to make sure it will display everything
                    break;
                case "View low inventory":
                    viewStore(5);
                    break;
                default:
                    connection.end(function (err) {
                        console.log("Connection to the app ended")
                    })
            }
        })
}