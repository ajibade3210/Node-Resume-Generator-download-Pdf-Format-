const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const pdf = require("html-pdf");
const dynamicResume = require("./docs/dynamic-resume");
const staticResume = require("./docs/static-resume");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static("public"));

// const html = fs.readFileSync("./test/businesscard.html", "utf8");
const options = {
  height: "9in",
  width: "8in",
};

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/resume-maker/:theme", (req, res, next) => {
  switch (req.params.theme) {
    case "1":
      res.render("resume-maker", { theme: "blue" });
      break;
    case "2":
      res.render("resume-maker", { theme: "green" });
      break;
    case "3":
      res.render("resume-maker", { theme: "green" });
      break;
  }
});

app.post("/resume-maker", (req, res, next) => {
  console.log(req.body);
  const userName = req.body.name;
  const lowercaseName = userName.toLowerCase();
  const noSpaceName = lowercaseName.replace(" ", "");
  const shortName = noSpaceName.slice(0, 10);
  console.log("shortName", shortName);

  let themeOptions = {
    leftTextColors: "rgb(91, 88, 255)",
    leftBackgroundColors: "rgb(12, 36, 58)",
    wholeBodyColors: "rgb(183, 182, 255)",
    rightTextColors: "rgb(1, 0, 66)",
  };

  if (req.body.theme === "blue") {
    themeOptions = {
      leftTextColors: "rgb(91, 88, 255)",
      leftBackgroundColors: "rgb(12, 36, 58)",
      wholeBodyColors: "rgb(183, 182, 255)",
      rightTextColors: "rgb(1, 0, 66)",
    };
  } else if (req.body.theme === "green") {
    themeOptions = {
      leftTextColors: "rgb(183, 255, 249)",
      leftBackgroundColors: "rgb(0, 119, 89)",
      wholeBodyColors: "rgb(139, 247, 285)",
      rightTextColors: "rgb(0, 119, 89)",
    };
  }

  //HTML to PDF Conversion
  pdf
    .create(dynamicResume(req.body, themeOptions), options)
    .toFile(
      __dirname + "/docs/" + shortName + "-resume.pdf",
      function (error, response) {
        if (error) return console.log(error);
        console.log(response.filename); // { filename: '/app/businesscard.pdf' }
        res.sendFile(response.filename);
      }
    );
});

app.get("/show-pdf", (req, res, next) => {
  res.render("show");
});

app.get("/pdf-static-resume", (req, res, next) => {
  pdf
    .create(staticResume(), options)
    .toFile(__dirname + "/docs/static-resume.pdf", function (error, response) {
      if (error) return console.log(error);
      console.log(response.filename); // { filename: '/app/businesscard.pdf' }
      res.sendFile(response.filename);
    });
});

app.get("/download-pdf", (req, res, next) => {
  const filePath = __dirname + "/docs/static-resume.pdf";
  res.download(filePath);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server is running on " + port));
