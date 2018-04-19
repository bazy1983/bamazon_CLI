var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

console.clear();

var items = [];

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
            head: ['ID', 'Name', "Price", "Quantity"],
             colWidths: [10, 20, 10, 10]
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
                case "Add to inventory":
                    addInventory();
                    break;
                case "Add new product":
                    addNewItem();
                    break;
                default:
                    connection.end(function (err) {
                        console.log("Connection to the app ended")
                    })
            }
        })
}

function addInventory() {
    inquirer.prompt([
        {
            name: "id",
            message: "What ID do you want to add to?"
        },
        {
            name: "quantity",
            message: "How many new units do you want to add?"
        }
    ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.id }, function (err, res) {

                let newStock = parseInt(answer.quantity) + res[0].stock_quantity;
                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newStock, answer.id])
                console.log(`Inventory for ${res[0].product_name} has increased from ${res[0].stock_quantity} to ${newStock}`);
                askManager();
            })
        })
}

function addNewItem() {
    var departmentArr = [];
    connection.query("SELECT department_name FROM departments ORDER BY department_name ASC", function(err, res){
        if (err) throw err;
        res.forEach(function(item){
            departmentArr.push(item.department_name);
        })
    })
    inquirer.prompt([
        {
            name: "product",
            message: "Product Name"
        },
        {
            type: "list",
            choices: departmentArr,
            name: "department",
            message: "Insert Department"
        },
        {
            name: "price",
            message: "Product price"
        },
        {
            name: "quantity",
            message: "Stock quantity"
        },
    ])
        .then(function (answer) {
            let price = parseInt(answer.price);
            let quantity = parseInt(answer.quantity);
            connection.query("INSERT INTO products SET ?", {
                product_name: answer.product,
                department_name: answer.department,
                price: price,
                stock_quantity: quantity
            }, function (err, res, fields){
                if (err) throw err;
                console.log(`${answer.product} is added successfully.`)
                askManager()
            })
        })
}