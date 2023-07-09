import "./styles.css";
import { Chart } from "frappe-charts";

const url =
  "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

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
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

// Function to create chart
function createPopulationChart(pdata) {
  const chart = new Chart("#chart", {
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
          name: "Population",
          type: "line",
          color: "#eb5146",
          values: pdata
        }
      ]
    },
    title: "Population growth",
    height: 450,
    type: "line",
    colors: ["#eb5146"]
  });

  chart.draw();
  return chart;
}

// Function to get municipality codes
async function getMunicipalityCodes(cityname) {
  const response = await fetch(url);
  const data = await response.json();

  // Extract municipality codes from the response
  let citycode = "";
  for (let i = 0; i < data.variables[1].valueTexts.length; i++) {
    if (
      data.variables[1].valueTexts[i].toLowerCase() === cityname.toLowerCase()
    ) {
      citycode = data.variables[1].values[i];
      break;
    }
  }
  return citycode;
}

function addDataPoint(chart, year, value) {
  // Add the new data point to the chart
  chart.data.labels.push(year);
  chart.data.datasets[0].values.push(value);

  // Redraw the chart
  chart.draw();
}

// Fetch population data for the whole country and create initial chart
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(requestData)
})
  .then((response) => response.json())
  .then((data) => {
    const lf = data.value.slice(-5);
    console.log(data.value.slice(-5));
    const chart = createPopulationChart(data.value);

    document.getElementById("add-data").addEventListener("click", () => {
      // Calculate the mean value of the delta of every data point
      const deltas = chart.data.datasets[0].values.map(
        (value, index, array) => {
          if (index === 0) {
            return 0;
          } else {
            return value - array[index - 1];
          }
        }
      );
      const meanValue =
        deltas.reduce((sum, value) => sum + value, 0) / deltas.length;
      const lastDataPoint = chart.data.datasets[0].values.slice(-1)[0];
      const newDataPoint = lastDataPoint + meanValue;

      //const meanValue = ((lf[1]-lf[0])+(lf[2]-lf[1])+(lf[3]-lf[2])
      addDataPoint(
        chart,
        String(chart.data.labels.length + 2000),
        newDataPoint
      );
    });
    const form = document.getElementById("search-form");
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("input-area").value;
      getMunicipalityCodes(name)
        .then((citycode) => {
          console.log(citycode);
          if (citycode) {
            const requestData2 = {
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
                    values: [citycode]
                  }
                },
                {
                  code: "Tiedot",
                  selection: {
                    filter: "item",
                    values: ["vaesto"]
                  }
                }
              ],
              response: {
                format: "json-stat2"
              }
            };

            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(requestData2)
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data.value);
                createPopulationChart(data.value);
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            console.log("Invalid municipality");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  })
  .catch((error) => {
    console.error(error);
  });
