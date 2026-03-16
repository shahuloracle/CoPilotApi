const { json } = require("express");


const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customer', (err, customers) => {
            if (err) {
                res.json(err);
            }

            const customerData = customers.map((customer) => {
                if (customer.id > 0) {
                    return {
                        ...customer,
                        action: 'update'
                    };
                }
                return customer;
            });
           
            res.json({
                success: true,
                data: customers
            });
        });
    });
};

controller.save = (req, res) => {
    
    const customers = req.body.customers; 
    var customerDML = customers.map(customer => {
        if(customer.id>0 && customer.name != "delete"){
            return { ...customer, action: 'UPDATE' };
        }
        else if(customer.id == 0){
            return { ...customer, action: 'INSERT' };
        }
        else if(customer.name === "delete"){
            return { ...customer, action: 'DELETE' };
        }
    });
    console.log("Received customers:", customerDML);
    
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({
                isSuccess: false,
                message: "Database connection failed",
                error: err.message
            });
        }
        
        conn.query('CALL sp_customer_bulk(?)', [JSON.stringify(customerDML)], (err, result) => {
            if (err) {
                return res.status(500).json({
                    isSuccess: false,
                    message: "Failed to save customer",
                    error: err.message
                });
            }

            res.json({
                isSuccess: true,
                message: "Customer saved successfully",
                data: {    
                }
            });
        });
    });
};


module.exports = controller;