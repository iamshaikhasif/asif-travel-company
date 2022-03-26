const jwt = require("jsonwebtoken");
const User = require("../model/user_model");
const Token = require("../model/token_model");
const { response } = require("../helper/utils");
const bcrypt = require("bcryptjs");

const mapReqToModel = (req) => {
  return {
    firstName: req.firstName,
    lastName: req.lastName,
    gender: req.gender,
    dob: req.dob,
    mobile: req.mobile,
    email: req.email,
    pincode: req.pincode,
    address: req.address,
    cityOrDistrict: req.cityOrDistrict,
    pin: req.pin
  }
};

const loginReqToModel = (req) => {
  return {
    mobile: req.mobile,
    pin: req.pin
  }
};

const signUp = async (req, res) => {
  const userRequest = mapReqToModel(req.body); //return request
  try {
    //find user already exist or not
    let user = await User.findOne({
      mobile: userRequest.mobile,
    });
    if (user) {
      return response(res, 400, 0, "User Already Exists", {});
    }

    //encrypt the pin number
    const salt = await bcrypt.genSalt(10);
    userRequest.pin = await bcrypt.hash(userRequest.pin, salt);

    //save the user to database
    user = new User({ ...userRequest });
    await user.save();

    //genrate token 
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: '365d',
      },
      async (err, encodedToken) => {
        if (err) throw err;

        token = new Token({
          user_id: user.id,
          token: encodedToken,
        });
        await token.save();
        return response(res, 200, 1, "User Successfully Registered", { token: encodedToken, user });
      }
    );
  } catch (err) {
    return response(res, 500, 0, "Exception", { error: err });
  }
}


const login = async (req, res) => {
  const userRequest = loginReqToModel(req.body);
  let user = await User.findOne({
    mobile: userRequest.mobile,
  });
  if (!user) {
    return response(res, 400, 0, "User Not Found", {});
  }

  const isMatch = await bcrypt.compare(userRequest.pin, user.pin);

  if (isMatch) {
    //genrate token 
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: '365d',
      },
      async (err, encodedToken) => {
        if (err) throw err;
        let token = await Token.findOneAndUpdate({ user_id: user.id }, { $set: { token: encodedToken } }, { new: true });
        if (!token) {
          token = new Token({
            user_id: user.id,
            token: encodedToken,
          });
          await token.save();
        }
        return response(res, 200, 1, "User Successfully Login", { token: encodedToken, user });
      }
    );
  } else {
    return response(res, 400, 0, "Invalid Password", {});
  }



}


module.exports = {
  signUp,
  login
};