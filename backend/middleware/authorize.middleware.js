/*
|--------------------------------------------------------------------------
| Role-based authorization
|--------------------------------------------------------------------------
| Works together with requireAuth (which sets req.user from the JWT).
| Administrator always passes. Usage:
|     router.post("/", requireAuth, authorize("Administrator","Finance Officer"), handler)
*/
function authorize(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }
    if (role === "Administrator" || allowed.includes(role)) return next();
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action.",
    });
  };
}

module.exports = { authorize };
