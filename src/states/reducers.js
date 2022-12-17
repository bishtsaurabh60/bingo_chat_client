export const userReducer = (userDetails, action) => {
  switch (action.type) {
    case "new_name":
      return {
        ...userDetails,
        name: action.newName,
      };
    case "new_email":
      return {
        ...userDetails,
        email: action.newEmail,
      };
    case "add_password":
      return {
        ...userDetails,
        password: action.addPassword,
      };
    case "show_hide_pass":
      return {
        ...userDetails,
        show: !userDetails.show,
      };
    case "add_confirm_pass":
      return {
        ...userDetails,
        confirmPassword: action.addConfirmPass,
      };
    case "add_profile_picture":
      return {
        ...userDetails,
        pic: action.upload,
      };
    default:
      throw new Error(`Unknown Action: ${action.type}`);
  }
};
