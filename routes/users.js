const express = require("express");
const router = express.Router();

// Static routes
router.get("/", (reg, res) => {
  res.send("User List");
});

router.get("/new", (reg, res) => {
  res.send("User New Form");
});

router.post("/", (reg, res) => {
  res.send("Create User");
});

// Dynamic parameter
router
  .route("/:id")
  .get((reg, res) => {
    res.send(`Get User with ID: ${reg.params.id}`);
  })
  .put((reg, res) => {
    res.send(`Update User with ID: ${reg.params.id}`);
  })
  .delete((reg, res) => {
    res.send(`Delete User with ID: ${reg.params.id}`);
  });


// Keep for learning purposes
// router.get("/:id", (reg, res) => {
//   res.send(`Get User with ID: ${reg.params.id}`);
// });

// router.put("/:id", (reg, res) => {
//   res.send(`Update User with ID: ${reg.params.id}`);
// });

// router.delete("/:id", (reg, res) => {
//   res.send(`Delete User with ID: ${reg.params.id}`);
// });

module.exports = router;