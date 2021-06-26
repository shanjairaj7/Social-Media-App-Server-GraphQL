const Yup = require("yup");

exports.signupInputValidation = async (signupInput) => {
  const userSchema = Yup.object({
    name: Yup.string().min(2).required(),
    email: Yup.string().min(4).email().required(),
    password: Yup.string().min(3).required(),
  });

  await userSchema.validate(signupInput);
};

exports.signinInputValidation = async (signinInput) => {
  const userSchema = Yup.object({
    email: Yup.string().min(4).email().required(),
    password: Yup.string().min(3).required(),
  });

  await userSchema.validate(signinInput);
};

exports.postInputValidation = async (postInput) => {
  const postSchema = Yup.object({
    message: Yup.string().required(),
  });

  await postSchema.validate(postInput);
};

exports.inviteUserInputValidation = async (inviteInput) => {
  const inviteSchema = Yup.object({
    email: Yup.string().email().required(),
  });

  await inviteSchema.validate(inviteInput);
};
