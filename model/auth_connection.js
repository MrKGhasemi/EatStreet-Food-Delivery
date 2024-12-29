const db = require("../data/database");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;
const uuid = require("uuid");

class Auth_model {
  constructor(
    req,
    email,
    confirm_email,
    password,
    tel,
    full_name,
    street,
    postal_code,
    city
  ) {
    (this.req = req),
      (this.email = email),
      (this.confirm_email = confirm_email),
      (this.password = password),
      (this.tel = tel),
      (this.full_name = full_name),
      (this.street = street),
      (this.postal_code = postal_code),
      (this.city = city);
  }
  async Check_Existing_user_base_email_entered() {
    const result = await db
      .getDB()
      .collection("users_data")
      .findOne({ email: this.email });
    return result;
  }

  async sign_up() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db
      .getDB()
      .collection("users_data")
      .insertOne({
        email: this.email,
        password: hashedPassword,
        full_name: this.full_name,
        tel: this.tel,
        address: [
          {
            street: this.street,
            postal_code: this.postal_code,
            city: this.city,
          },
        ],
      });
  }

  async check_for_sign_in() {
    const result = await db
      .getDB()
      .collection("users_data")
      .findOne({ email: this.email });

    if (!result) {
      // Handle the case where the user is not found
      return false;
    }

    return bcrypt.compare(this.password, result.password);
  }

  async make_session_for_sign_in() {
    const user = await this.Check_Existing_user_base_email_entered();
    if (user) {
      if (user.is_admin) {
        // Admin user session setup
        this.req.session.user = { id: user._id.toString(), email: user.email };
        this.req.session.isAuth = true;
        this.req.session.isAdmin = true;
        await this.req.session.save(); // Ensure session is saved
      } else {
        // Regular user session setup
        this.req.session.user = { id: user._id.toString(), email: user.email };
        this.req.session.isAuth = true;
        this.req.session.isAdmin = false;

        // Handle user orders
        const userOrders = await db
          .getDB()
          .collection("orders")
          .find({ UserID: this.req.session.user.id })
          .count();
        this.req.session.orders = userOrders || 0;

        // Update session's card count by summing up quantities
        const userCart = await db
          .getDB()
          .collection("carts")
          .findOne({ UserAuthID: this.req.session.user.id });

        if (userCart) {
          this.req.session.cards = userCart.products.reduce(
            (total, product) => {
              return (
                total +
                product.foods.reduce((sum, food) => sum + food.quantity, 0)
              );
            },
            0
          );
        } else {
          this.req.session.cards = 0; // No products in the cart
        }

        await this.req.session.save(); // Save the session with updated cart count
      }
    }

    // Set guestId for new sessions
    this.req.session.guestId = uuid.v4();
  }

  async config_session_for_log_out() {
    this.req.session.user = null;
    this.req.session.isAuth = false;
    this.req.session.isAdmin = false;
    // this.req.session.guestId = uuid.v4();
    this.req.session.cards = 0;
    this.req.session.orders = 0;
    this.req.session.save(); // Use await here to wait for the session to save
    // console.log(this.req.session.guestId);
  }
}
module.exports = Auth_model;
