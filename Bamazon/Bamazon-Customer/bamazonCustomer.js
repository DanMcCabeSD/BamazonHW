var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Coding4Days",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the askForItemID function after the connection is made to prompt the user
  loadProducts();
});

function loadProducts() {
  connection.query("SELECT * FROM products", function(err, res){
    if (err) throw err;
    console.table(res);
    askForItemID(res);
    
  })
}
// function which prompts the user for what action they should take
function askForItemID(inventory) {
  inquirer
    .prompt({
      name: "IDofProduct",
      type: "input",
      message: "What is the ID of the product they would like to buy?"
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      var productID = parseInt(answer.IDofProduct);
      //console.log(productID);
      var product = checkInventory(productID, inventory);
     //console.log(answer.nameOfProduct);
     //console.log(product);
     if(product){
      //console.log("Hello World");
      askForQuantityOfProduct(product);
     }
     else{
      //console.log("Hello World");
      loadProducts();
     }
     
    });
}



// function which prompts the user for what action they should take
function askForQuantityOfProduct(product) {
  inquirer
    .prompt({
      name: "quantityOfProduct",
      type: "input",
      message: "How many units of this product they would like to buy?"
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      var productQuantity = parseInt(answer.quantityOfProduct);
     //console.log(answer.quantityOfProduct);
    if (productQuantity > product.stock_quantity){
      console.log("Insufficient quantity!");
      loadProducts();
    }
    else {
      console.log(productQuantity);
      connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [productQuantity, product.item_id],
        function(err, res){
          loadProducts();
        }       
      )
    }
  });
}

function checkInventory(productID, inventory){
  //console.log(inventory);
  //console.log(productID);
  for(var i = 0; i < inventory.length; i++){
    if(inventory[i].item_id === productID){
      //console.log(inventory[i].item_id);
      return inventory[i];
    }
  }
  return null;
}
