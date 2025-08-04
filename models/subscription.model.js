import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP","MYR"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "education",
        "other",
      ],
    },
    payment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

function addRenewal(date, frequency) {
  const newDate = new Date(date);
  if (frequency === "daily") newDate.setDate(newDate.getDate() + 1);
  else if (frequency === "weekly") newDate.setDate(newDate.getDate() + 7);
  else if (frequency === "monthly") newDate.setMonth(newDate.getMonth() + 1);
  else if (frequency === "yearly")
    newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
}

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    this.renewalDate = addRenewal(this.startDate, this.frequency);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (this.renewalDate < today) {
    if (this.status === "active") {
      // Auto-renew forward
      while (this.renewalDate < today) {
        this.renewalDate = addRenewal(this.renewalDate, this.frequency);
      }
    } else {
      // Mark as expired if not active
      this.status = "expired";
    }
  }

  next();
});

const Subscription = mongoose.model('Subscription',subscriptionSchema)

export default Subscription