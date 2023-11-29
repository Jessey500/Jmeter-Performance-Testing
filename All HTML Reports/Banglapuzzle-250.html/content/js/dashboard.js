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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.011, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.002, 500, 1500, "https://www.banglapuzzle.com/hire"], "isController": false}, {"data": [0.032, 500, 1500, "https://www.banglapuzzle.com/hire/subcategory-flutter"], "isController": false}, {"data": [0.002, 500, 1500, "https://www.banglapuzzle.com/industry/rmg-sector"], "isController": false}, {"data": [0.016, 500, 1500, "https://www.banglapuzzle.com/about"], "isController": false}, {"data": [0.002, 500, 1500, "https://www.banglapuzzle.com/career"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/products"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/services"], "isController": false}, {"data": [0.002, 500, 1500, "https://www.banglapuzzle.com/contact"], "isController": false}, {"data": [0.002, 500, 1500, "https://www.banglapuzzle.com/industry/softwareites"], "isController": false}, {"data": [0.072, 500, 1500, "https://www.banglapuzzle.com/industry/government-defense"], "isController": false}, {"data": [0.002, 500, 1500, "https://www.banglapuzzle.com/industry/healthcare"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2750, 0, 0.0, 12021.075636363645, 601, 193760, 12606.0, 16429.8, 17205.9, 21197.069999999992, 9.521633150517976, 756.5150050388916, 10.69239503914257], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.banglapuzzle.com/hire", 250, 0, 0.0, 13433.180000000002, 1052, 18065, 12992.0, 16469.1, 17031.95, 17670.68, 1.8080697770288352, 115.40936225310807, 2.125894542522185], "isController": false}, {"data": ["https://www.banglapuzzle.com/hire/subcategory-flutter", 250, 0, 0.0, 8961.383999999995, 654, 18251, 8726.5, 16356.1, 16857.3, 18085.55, 1.9550342130987293, 130.41806421065493, 2.336876832844575], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/rmg-sector", 250, 0, 0.0, 13686.803999999998, 687, 19923, 13301.5, 16641.6, 17201.1, 18670.400000000005, 1.4645920232460046, 136.6271786721716, 1.743493824547734], "isController": false}, {"data": ["https://www.banglapuzzle.com/about", 250, 0, 0.0, 10366.808000000005, 696, 16465, 12274.5, 14449.6, 14969.949999999999, 15781.520000000004, 1.6293225928388013, 109.96745606327964, 1.9173180902058162], "isController": false}, {"data": ["https://www.banglapuzzle.com/career", 250, 0, 0.0, 12270.923999999999, 633, 16401, 12620.5, 14664.7, 15049.449999999999, 15995.210000000003, 1.6313958875772465, 71.45071726359443, 1.921351016033359], "isController": false}, {"data": ["Test", 250, 0, 0.0, 132231.83199999997, 101375, 214001, 134510.0, 143382.6, 144514.94999999998, 147793.64, 1.166267803078014, 1019.2883792857426, 14.406368594857225], "isController": true}, {"data": ["https://www.banglapuzzle.com/products", 250, 0, 0.0, 13565.976000000004, 2049, 193760, 12858.0, 21413.100000000002, 22421.0, 24343.700000000004, 1.2884207054361048, 83.31407412799686, 0.640435682682595], "isController": false}, {"data": ["https://www.banglapuzzle.com/services", 250, 0, 0.0, 13331.795999999995, 10317, 16496, 13588.5, 15048.400000000001, 15451.949999999999, 15936.440000000002, 1.2338976358521296, 123.91436287695572, 1.4556136172943093], "isController": false}, {"data": ["https://www.banglapuzzle.com/contact", 250, 0, 0.0, 13980.819999999996, 1198, 18438, 13939.5, 16988.8, 17498.15, 18262.71, 1.6738418688109697, 156.44309335183488, 1.9729757184129302], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/softwareites", 250, 0, 0.0, 14874.859999999999, 947, 20044, 14868.0, 16968.1, 17244.649999999998, 18832.320000000018, 1.3842286524257224, 129.10869344041726, 1.6505304537224676], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/government-defense", 250, 0, 0.0, 6132.947999999999, 601, 19048, 5688.0, 11842.4, 13411.55, 15959.230000000014, 1.5820281601012498, 148.28497023809524, 1.8956528832463218], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 250, 0, 0.0, 11626.332000000004, 683, 17325, 11469.5, 13670.5, 14571.25, 16904.610000000004, 1.3159141392342433, 122.7802738795649, 1.5665032575454516], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2750, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
