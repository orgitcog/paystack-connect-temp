import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

// Keep the schema name as 'SalonV3' for backward compatibility with existing databases
const accountSchemaName = 'SalonV3';

// Define the Account schema (formerly Salon).
const AccountSchema = new Schema<Express.Request['user']>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // Custom validator to check if the email was already used.
      validator: AccountEmailValidator,
      message: 'This email already exists. Please try to log in instead.',
    },
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  // Stripe account ID to send payments obtained with Stripe Connect.
  stripeAccountId: String,
  // Can be no_dashboard_soll, no_dashboard_poll, dashboard_soll. Default is no_dashboard_soll
  accountConfig: String,
  businessName: String,
  quickstartAccount: Boolean,
  changedPassword: Boolean,
  setup: Boolean,
  primaryColor: String,
  companyName: String, // Custom company name to replace zone default
  companyLogoUrl: String, // URL to custom company logo uploaded to Stripe
});

// Check the email address to make sure it's unique (no existing account with that address).
function AccountEmailValidator(email: string) {
  // Asynchronously resolve a promise to validate whether an email already exists
  return new Promise((resolve, reject) => {
    // Only check model updates for new accounts (or if the email address is updated).
    // @ts-ignore - 'this' implicitly has type 'any' because it does not have a type annotation.ts(2683)
    if (this.isNew || this.isModified('email')) {
      // Try to find a matching account
      Account.findOne({email}).exec((err, account) => {
        // Handle errors
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        // Validate depending on whether a matching account exists.
        if (account) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(true);
    }
  });
}

// Generate a password hash (with an auto-generated salt for simplicity here).
AccountSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, 8);
};

// Check if the password is valid by comparing with the stored hash.
AccountSchema.methods.validatePassword = function (password) {
  if (!this.changedPassword) {
    return password == this.password;
  }
  return bcrypt.compareSync(password, this.password);
};

// Pre-save hook to define some default properties for accounts.
AccountSchema.pre('save', function (next) {
  // Make sure the password is hashed before being stored.
  if (this.isModified('password') && !this.quickstartAccount) {
    this.password = this.generateHash(this.password);
  } else if (this.quickstartAccount) {
    this.password = this.password;
  }
  next();
});

const Account =
  mongoose.models[accountSchemaName] ||
  mongoose.model(accountSchemaName, AccountSchema);

export default Account;

// Export as Salon for backward compatibility
export {Account as Salon};
