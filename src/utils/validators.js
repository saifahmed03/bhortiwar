export const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

export const isPasswordStrong = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

export const isNotEmpty = (value) => value && value.trim() !== "";
