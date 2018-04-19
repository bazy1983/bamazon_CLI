var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

console.clear();
var table = new Table({
    head: ['ID', 'Name', "Price"]
    , colWidths: [10, 20, 10]
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

    viewStore()
})

function viewStore() {
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, res) { //show all products if stock is higher than zero
        res.forEach(element => {
            items.push(element.item_id)
            table.push([element.item_id, element.product_name, `$${element.price}.00`])
        });
        console.log(table.toString());

        askCustomer(res);
    })
}

function askCustomer(res) {
    inquirer.prompt([
        {
            name: "id",
            message: "Which product would you like to buy (insert product ID)?",
            validate: function (value) {
                if (isNaN(value)) {//only accept numbers
                    return false;
                } else {
                    return items.includes(parseInt(value));
                }
            }
        }, {
            name: "quantity",
            message: "Enter qauntity:",
            validate: function (value) {
                if (isNaN(value)) {//only accept numbers
                    return false;
                } else {
                    return true;
                }
            }
        }
    ])
        .then(function (answer) {

            checkDB(answer.id, answer.quantity)
            //endConnection()
        })
};

function checkDB(id, quantity) {
    connection.query("SELECT * FROM products WHERE ?", { item_id: id }, function (err, res) {
        var product = res;
        if (res[0].stock_quantity < quantity) {
            console.log("Sorry!, Insufficient quantity!")
            endConnection()
        } else {
            confirmPurchase(product, quantity)
        }
    })
}

function confirmPurchase(product, quantity) {
    let total = parseInt(quantity) * product[0].price; //calculate total price
    let newStock = product[0].stock_quantity - parseInt(quantity);
    inquirer.prompt({ //confirm purchase
        type: "confirm",
        name: "purchase",
        message: `Product: ${product[0].product_name}; Quantity: ${quantity}; Total cost: $${total}.00, Proceed?`
    })
        .then(function (answer) {
            if (answer.purchase) {
                console.log("Transaction Successful")
                connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [newStock, total, product[0].item_id])
                endConnection()
            } else {
                console.log("Transaction Cancelled")
                endConnection()
            }
        })
}

function endConnection() {

    connection.end(function (err) {
        console.log("Connection to the app ended")
    })
}