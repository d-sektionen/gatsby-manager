const express = require("express");
const { spawn } = require("child_process");
const readline = require("readline");
const stripAnsi = require("strip-ansi");
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const app = express();

const port = process.env.PORT || 3000;
const gatsbyPath = process.env.GATSBY_PATH;

let log = "";
let subprocess = null;
let started = null;
let finished = null;
let duration = null;

const getResponse = () => ({
  running: subprocess !== null,
  log,
  started,
  finished,
  duration
});

const appendToLog = data => {
  text = data.toString("utf-8");
  if (text !== "") log += stripAnsi(text) + "\n";
};

if (!gatsbyPath) console.error("GATSBY_PATH environment variable is required!");

app.get("/", (req, res) => {
  return res.json(getResponse());
});

app.post("/", (req, res) => {
  if (!subprocess) {
    subprocess = spawn("npm", ["run", "build"], {
      cwd: gatsbyPath
    });

    log = "";
    started = new Date();

    readline
      .createInterface({
        input: subprocess.stdout,
        terminal: false
      })
      .on("line", line => {
        appendToLog(line);
      });
    readline
      .createInterface({
        input: subprocess.stderr,
        terminal: false
      })
      .on("line", line => {
        appendToLog(line);
      });

    subprocess.on("close", code => {
      if (code !== 0) {
        appendToLog(`Gatsby process exited with code ${code}`);
      } else {
        finished = new Date();
        duration = finished - started;
      }
      subprocess = null;
    });
  }
  return res.json(getResponse());
});

app.listen(port, () =>
  console.log(`gatsby manager listening on port ${port}!`)
);
