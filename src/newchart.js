import "./styles.css";
import { Chart } from "frappe-charts";

const url =
  "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
function formRequestData(code) {
  // Request data object for the API call
  const requestData = {
    query: [
      {
        code: "Vuosi",
        selection: {
          filter: "item",
          values: [
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021"
          ]
        }
      },
      {
        code: "Alue",
        selection: {
          filter: "item",
          values: ["SSS"]
        }
      },
      {
        code: "Tiedot",
        selection: {
          filter: "item",
          values: [code]
        }
      }
    ],
    response: {
      format: "json-stat2"
    }
  };
  return requestData;
}

const birthdata = formRequestData("vm01");
const deathdata = formRequestData("vm11");

let bdata;
let ddata;

// Fetch birth data
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(birthdata)
})
  .then((response) => response.json())
  .then((data) => {
    bdata = data.value;
    // Fetch death data
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(deathdata)
    });
  })
  .then((response) => response.json())
  .then((data) => {
    ddata = data.value;
    // Create and render the chart
    const newchartid = document.getElementById("newchart");
    const newchart = new Chart(newchartid, {
      data: {
        labels: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ],
        datasets: [
          {
            name: "Births",
            type: "bar",
            color: "#63d0ff",
            values: bdata
          },
          {
            name: "Deaths",
            type: "bar",
            color: "#363636",
            values: ddata
          }
        ]
      },
      title: "Population growth",
      height: 450,
      type: "bar"
    });

    newchart.draw();
  })
  .catch((error) => {
    console.error(error);
  });

// Navigation button event listener
const navigationButton = document.getElementById("navigation");
navigationButton.addEventListener("click", () => {
  // Navigate to /index.html
  window.location.href = "/index.html";
});
