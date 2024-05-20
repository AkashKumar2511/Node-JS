//IMPORTS
//CORE MODULES
const fs = require("fs");
const http = require("http");
const url = require("url");
//THIRD PARTY MODULES
const slugify = require("slugify");
//OWN MODULES
const replaceTemplate = require("./modules/replaceTemplate");

//TEMPLATES
const templateOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const templateCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const templateProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

//AVOIDING MULTIPLE READS FOR EACH REQUEST
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
//PARSING FROM STRING TO JS OBJECT
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);


//CREATING A SERVER
const server = http.createServer((req, res) => {
  //ROUTING
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    //HEADER INFO
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  //PRODUCT PAGE
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }
  //NOT FOUND
  else {
    res.end("Page Not Found");
  }
});



server.listen(3000, "127.0.0.1", () => {
  console.log("Listening to requests on port 3000");
});



/////////////////////////////////////////////////////////////
// // FS PRACTICE
// const textIn = fs.readFileSync("1-node-farm/starter/txt/input.txt", "UTF-8");
// console.log(textIn);

// const textOut = `This is what we about the avocado : ${textIn}\n. Created on ${Date.now()}`;
// fs.writeFileSync("1-node-farm/starter/txt/output.txt", textOut);

// // non-blocking async way
// //CALLBACK HELL
// fs.readFile("1-node-farm/starter/txt/start.txt", "utf-8", (err, data1) => {
//     fs.readFile(`1-node-farm/starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//         fs.readFile("1-node-farm/starter/txt/append.txt", "utf-8", (err, data3) => {
//             console.log(data3);

//             fs.writeFile("1-node-farm/starter/txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//                 console.log("File has been written ")
//             })
//         });
//         console.log(data2);
//     });
//     console.log(data1);
// });
// console.log("File will be read");

//////////////////////////////////////////////////////////////////
