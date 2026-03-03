import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { planId, amount , credits} = req.body;

    if (!planId || !amount) {
      return res
        .status(400)
        .json({ message: "Plan ID and amount are required" });
    }
    // Create order in Razorpay
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id
, razorpay_order_id, razorpay_signature
 } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

      console.log(expectedSignature, " ", razorpay_signature)

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    //update payment status
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    //add credits to user account based on plan
    const updatedUser = await User.findByIdAndUpdate(
      payment.userId,
      { $inc: { credits: payment.credits } },
      { new: true },
    );

    return res
      .status(200)
      .json({ message: "Payment verified", user: updatedUser });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Error verifying payment" });
  }
};
