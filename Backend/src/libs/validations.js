import { body } from "express-validator";

const registerValidation = () => {
      return [
            body("name")
                  .trim()
                  .notEmpty()
                  .withMessage("Name is required"),

            body("username")
                  .trim()
                  .notEmpty().withMessage("Username is required")
                  .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
                  .isLength({ max: 20 }).withMessage("Username must be at most 20 characters long"),

            body("email")
                  .trim()
                  .notEmpty().withMessage("Email is required")
                  .isEmail().withMessage("Invalid email format"),

            body("password")
                  .trim()
                  .notEmpty().withMessage("Password is required")
                  .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

            body("avatar")
                  .trim()
                  .optional()
                  .isURL().withMessage("Avatar must be a valid URL"),

            body("role")
                  .optional()
                  .isIn(["ADMIN", "USER"]).withMessage("Role must be either ADMIN or USER"),

            body("bio")
                  .trim()
                  .optional()
                  .isLength({ max: 160 }).withMessage("Bio must be at most 160 characters long"),

            body("location")
                  .trim()
                  .optional()
                  .isLength({ max: 100 }).withMessage("Location must be at most 100 characters long"),

            body("socials")
                  .optional()
                  .isObject().withMessage("Socials must be a valid JSON object"),
      ];
};

export {
      registerValidation
}