var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "07702535961Mm",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;

    askSupervisor()

})

function askSupervisor() {
    inquirer.prompt({
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Quit"]
    })
        .then(function (answer) {
            switch (answer.options) {
                case "View Product Sales by Department":
                    viewDepartments();
                    break;
                case "Create New Department":
                    createDepartment();
                    break;
                default:
                    connection.end();
            }
        })
}

function viewDepartments() {

    query = "SELECT departments.*, SUM(products.product_sales) AS sales ,(SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name"

    connection.query(query, function (err, res) {
        if (err) console.log(err)
        var table = new Table({
            head: ['ID', 'Department', "Overhead cost", "Sales", "Profit"],
            colWidths: [10, 20, 20, 20, 20]
        });
        res.forEach(element => {
            if (element.sales === null) element.sales = ""; //cli-table limitation, couldn't read null
            table.push([element.department_id, element.department_name, element.over_head_costs, element.sales, element.total_profit]);
        });
        console.log(table.toString());
        askSupervisor();
    })


}

function createDepartment() {
    connection.query("SELECT department_name FROM departments", function (err, res) {
        if (err) throw err
        console.log(res)
    })
    inquirer.prompt([
        {
            name: "department",
            message: "Create new Department: "
        },
        {
            name: "cost",
            message: "Set overhead cost: ",
            validate: function(value){
                if (isNaN(value)) {
                    return false
                } else {
                    return true
                }
            }
        }
    ])
        .then(function(answer){
            let cost = parseInt(answer.cost);
            connection.query("INSERT INTO departments SET ?", {
                department_name : answer.department,
                over_head_costs : cost
            })
            askSupervisor();
        })
}

