/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.008541666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/hire"], "isController": false}, {"data": [0.0275, 500, 1500, "https://www.banglapuzzle.com/hire/subcategory-flutter"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/industry/rmg-sector"], "isController": false}, {"data": [0.0125, 500, 1500, "https://www.banglapuzzle.com/about"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/career"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/products"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/services"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/contact"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/industry/softwareites"], "isController": false}, {"data": [0.0625, 500, 1500, "https://www.banglapuzzle.com/industry/government-defense"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/industry/healthcare"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 0, 0.0, 9347.880000000001, 641, 33358, 9748.5, 12899.300000000001, 13953.899999999996, 18274.989999999998, 11.35431128360489, 902.1264969869143, 12.75041578713763], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.banglapuzzle.com/hire", 200, 0, 0.0, 10129.395000000002, 4407, 29488, 10098.0, 12246.7, 14050.949999999995, 18700.560000000005, 3.165608825717406, 202.0620169973409, 3.722063502113044], "isController": false}, {"data": ["https://www.banglapuzzle.com/hire/subcategory-flutter", 200, 0, 0.0, 6710.6, 665, 13629, 6461.5, 11299.2, 12266.949999999999, 13062.83, 3.6743092298647855, 245.10875524737287, 4.391947751322751], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/rmg-sector", 200, 0, 0.0, 11074.785000000003, 2314, 16287, 10637.0, 14210.2, 14938.849999999997, 16101.35, 6.065936732279883, 565.8665060299203, 7.2210711686027125], "isController": false}, {"data": ["https://www.banglapuzzle.com/about", 200, 0, 0.0, 8192.299999999997, 641, 11840, 10034.5, 10959.0, 11121.949999999999, 11383.93, 4.828818388140422, 325.91166582162344, 5.682349763387899], "isController": false}, {"data": ["https://www.banglapuzzle.com/career", 200, 0, 0.0, 9882.845000000007, 4137, 22862, 10068.0, 11112.0, 11829.1, 20319.730000000025, 3.2860147213459516, 143.91849168843652, 3.8700524940851735], "isController": false}, {"data": ["Test", 200, 0, 0.0, 102826.68, 75753, 118347, 105224.0, 112107.1, 112604.35, 118321.08, 1.6763756757889443, 1465.1115035387243, 20.70749601860777], "isController": true}, {"data": ["https://www.banglapuzzle.com/products", 200, 0, 0.0, 11074.580000000005, 3000, 20228, 10910.5, 17491.9, 18906.35, 19637.55, 9.87751876728566, 638.7222754253506, 4.909821340379296], "isController": false}, {"data": ["https://www.banglapuzzle.com/services", 200, 0, 0.0, 9853.290000000005, 6970, 12471, 9908.5, 11739.9, 12075.199999999999, 12425.8, 7.180039490217196, 721.0634942671873, 8.470202836115599], "isController": false}, {"data": ["https://www.banglapuzzle.com/contact", 200, 0, 0.0, 11617.565000000002, 7486, 33358, 11064.5, 13400.1, 16474.049999999985, 19478.74, 2.92560194259969, 273.43610005375797, 3.448439008513502], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/softwareites", 200, 0, 0.0, 10561.984999999995, 6847, 13993, 9684.5, 13142.1, 13482.65, 13926.490000000002, 5.447216472382612, 508.06954052729054, 6.495167297635908], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/government-defense", 200, 0, 0.0, 4908.07, 671, 11045, 4610.5, 9104.4, 10117.499999999998, 10951.890000000001, 5.7851956842440195, 542.2500354795204, 6.932065531804113], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 200, 0, 0.0, 8821.265, 6361, 12355, 9019.0, 10567.0, 11213.949999999999, 12222.78, 6.404303692081078, 597.5511481215377, 7.623873242819175], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
