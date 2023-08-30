const {Op} = require("sequelize");
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
      where: {
        isDeleted: false
      }
    },
  );

  if (!customers) res.status(401).send({message: "Customers Not Found!"});
  res.status(200).send({customers});
};

exports.getAllCustomersLimitization = async (req, res) => {
  const {limit, skip, filter} = req.body;

  const customers = await Customer.findAll({
    limit,
    offset: skip,
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
    where: {
      customerName: {
        [Op.like]: `%${filter}%`,
      },
      isDeleted: false
    },
  });

  const customerCount = await Customer.count({
    where: {}
  })

  if (!customers)
    return res.status(401).send({message: "Customers Not Found!"});
  return res.status(200).send({customers});
  // filterOptions: sütun ismi ve değeri
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

  const customer = await Customer.findAll({where: {customerName}});
  if (customer.length !== 0)
    return res
      .status(500)
      .send({message: "Aynı isimli müşteriniz bulunmaktadır!"});

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
      res.status(200).send({customer});
    })
    .catch((err) => {
      res.status(500).send({message: err.message});
    });
};

exports.updateCustomer = async (req, res) => {
  const {
    customerId,
    accountNumber,
    customerName,
    email,
    phone,
    isActive,
    createdBy,
    updatedBy,
  } = req.body;
  if (!customerId) res.status(401).send({message: "Customer id not found!"});

  const customer = await Customer.update(
    {
      accountNumber,
      customerName,
      email,
      phone,
      isActive,
      createdBy,
      updatedBy,
    },
    {
      where: {customerId},
    }
  );
  if (!customer) {
    res.status(403).send({message: "Customer update error"});
  }
  res.status(200).send({customer});
};

exports.deleteCustomer = async (req, res) => {
  const {customerId} = req.body;
  if (!customerId) res.status(401).send({message: "Customer id not found!"});

  Customer.update({
    isDeleted: true
  }, {
    where: {customerId},
  })
    .then((customer) =>
      res.status(200).send({message: "User deleted successfull", customer})
    )
    .catch((err) => res.status(500).send({message: err.message}));
};
