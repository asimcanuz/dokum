const db = require("../models");
const Customer = db.customer;

exports.getAllCustomers = async (req, res) => {
  const customers = await Customer.findAll({
    attributes: [
      "customerId",
      "accountNumber",
      "customerName",
      "email",
      "phone",
      "createdBy",
      "updatedBy",
      "isActive",
    ],
  });

  if (!customers) res.status(401).send({ message: "Customers Not Found!" });
  res.status(200).send({ customers });
};

exports.addNewCustomer = async (req, res) => {
  const {
    accountNumber,
    customerName,
    email,
    phone,
    createdBy,
    updatedBy,
    isActive,
  } = req.body;

  Customer.create({
    accountNumber,
    customerName,
    email,
    phone,
    createdBy,
    updatedBy,
    isActive,
  })
    .then((customer) => {
      res.status(200).send({ customer });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
