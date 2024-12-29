const express = require("express");
const router = express.Router();
const multer = require("multer");
const admin_controllers = require("../controllers/admin_controllers");
const uuid = require("uuid").v4;

const storageConfig = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./images"); // error, desination
  },
  filename: function (request, file, callback) {
    callback(null, uuid() + "-" + file.originalname); // error,filename
  },
});
const upload = multer({ storage: storageConfig });

router.get("/", admin_controllers.getAdminPage);

router.get("/admin", admin_controllers.getAdminPage);

router.get("/admin/manage_orders", admin_controllers.getManageOrdersPage);

router.post(
  "/admin/manage_orders/:id/update",
  admin_controllers.postManageOrders
);

module.exports = router;
