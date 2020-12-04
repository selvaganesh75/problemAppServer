const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')
const role = require("../middleware/role")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    address: {
      type: String
    },
    empId: {
      type: Number,
      required: true,
      validate: {
        validator: v => validator.isNumeric(v.toString()),
        message: 'EMP_ID_NOT_VALID'
      }
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    gender: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isIn(v, ['male', 'female', 'transgender'])
        },
        message: 'NOT_A_VALID_GENDER'
      },
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: role.allUser(),
      default: 'member'
    },
    verification: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    dob: {
      type: Date
    },
    postalCode: {
      type: Number
    },
    urlTwitter: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
    },
    urlGitHub: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    },
    avatar: {
      type: Buffer
    },
    aboutMe: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    user.password = newHash
    return next()
  })
}

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(user, salt, next)
  })
}

UserSchema.pre('save', function(next) {
  const that = this
  const SALT_FACTOR = 5

  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function(passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}
UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)