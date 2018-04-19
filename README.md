# bamazon_CLI

Bamazon is a CLI node application that sersembles online store where customers can pruchase different products.
The app uses node packages like inquirer, cli-table, and mysql.

The goal of the app is to connect to mySQL database and read/write data in database.
the app consists of 3 apps.
- bamazonCustomer : it allows customers to get all the products from mySQL database and choose a product for purchase.
- bamazonManager: that app is meant for store manager where they can manage inventory and add products.
- bamazonSupervisor: Supervisors can use the app and see revenue the store is making.

##bamazonCustomer
The app will first prompt the user with all products available in the store, then asks the user to purchase any of the products.
[](images/customer1.png)