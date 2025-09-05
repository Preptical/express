const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  console.log("INFO home hit");
  res.send("Hello from Dynatrace Demo!");
});

app.get("/api/external", async (req, res) => {
  try {
    const r = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    console.log("INFO external_api_ok", { status: r.status });
    res.json(r.data);
  } catch (e) {
    console.error("ERROR external_api_fail", { msg: e.message });
    res.status(502).json({ error: "upstream failed" });
  }
});

app.get("/api/error", (req, res) => {
  console.error("ERROR forced_route", { id: Date.now() });
  throw new Error("boom");
});

app.get("/api/logfile", (req, res) => {
  const line = `${new Date().toISOString()} WORKER processed job\n`;
  fs.appendFileSync("/home/logfiles/app-custom.log", line);
  console.log("INFO wrote_logfile_line");
  res.json({ ok: true });
});

app.listen(process.env.PORT || 8080);
