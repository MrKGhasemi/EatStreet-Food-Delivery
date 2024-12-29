const db = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

async function getAdminPage(req, res) {
  if (res.locals.isAdmin) {
    res.redirect("/restaurants");
  } else {
    res.redirect("/restaurants");
  }
}

async function getManageOrdersPage(req, res) {
  await db.getDB().collection("orders").deleteMany({ products: [] });

  const orders_table = await db.getDB().collection("orders").find().toArray();

  if (orders_table) {
    console.log("orders_table_found");
    // console.log(orders_table);

    for (order of orders_table) {
      if (order.date instanceof Date) {
        // Check if postData.date is a Date object
        order.toseeDate = order.date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        order.date = order.date.toISOString();
      }
    }
    res.render("admin/admin_manage_orders", {
      orders_finally_table: orders_table,
      found: true,
    });
  } else {
    res.render("admin/admin_manage_orders", {
      found: false,
    });
  }
}

async function postManageOrders(req, res) {
  const option_selected = req.body.option;
  await db
    .getDB()
    .collection("orders")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { State: option_selected } }
    );
  res.redirect("http://localhost:5000/admin/manage_orders");
}

module.exports = {
  getAdminPage: getAdminPage,
  getManageOrdersPage: getManageOrdersPage,
  postManageOrders: postManageOrders,
};
