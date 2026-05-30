const { setCorsHeaders } = require("../lib/cors");

module.exports = function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  res.status(200).json({
    ok: true,
    service: "justice-cat-backend",
  });
};
