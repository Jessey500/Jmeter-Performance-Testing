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

    var data = {"OkPercent": 99.9090909090909, "KoPercent": 0.09090909090909091};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.00125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/hire"], "isController": false}, {"data": [0.015, 500, 1500, "https://www.banglapuzzle.com/hire/subcategory-flutter"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/industry/rmg-sector"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/about"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/career"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/products"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/services"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/contact"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/industry/softwareites"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/industry/government-defense"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/industry/healthcare"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3300, 3, 0.09090909090909091, 16494.70484848492, 664, 43732, 16633.5, 21972.9, 24383.349999999995, 31887.029999999955, 11.882942216492804, 943.1074708316529, 13.331189865110602], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.banglapuzzle.com/hire", 300, 0, 0.0, 17838.079999999994, 9405, 43732, 16788.5, 21524.0, 22121.35, 24649.630000000016, 3.525222970352875, 225.01742644401946, 4.144891070610216], "isController": false}, {"data": ["https://www.banglapuzzle.com/hire/subcategory-flutter", 300, 0, 0.0, 13315.699999999992, 664, 22696, 13909.5, 19949.0, 20526.55, 21903.230000000003, 4.295532646048111, 286.54793545962195, 5.134503865979381], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/rmg-sector", 300, 0, 0.0, 19626.74666666664, 10738, 25986, 19764.0, 22521.5, 23301.2, 24351.47, 5.261957799098451, 490.86767697169944, 6.2639907784189575], "isController": false}, {"data": ["https://www.banglapuzzle.com/about", 300, 0, 0.0, 15440.423333333327, 4234, 34959, 12791.5, 29733.0, 31993.35, 34125.47, 4.3253842382998355, 291.9318264250339, 5.089929694483693], "isController": false}, {"data": ["https://www.banglapuzzle.com/career", 300, 0, 0.0, 18294.50666666667, 3719, 34684, 18113.5, 29909.4, 31477.249999999996, 34001.200000000004, 3.568157760148435, 156.27631980951986, 4.202342049549817], "isController": false}, {"data": ["Test", 300, 3, 1.0, 181441.7533333333, 146855, 203169, 184277.0, 195611.0, 196250.35, 200616.54, 1.4760728589563181, 1288.6580166362637, 18.2156808447565], "isController": true}, {"data": ["https://www.banglapuzzle.com/products", 300, 0, 0.0, 14474.953333333333, 2034, 27034, 14480.5, 23869.800000000007, 24970.75, 26393.58, 11.064394777605665, 715.4651857665781, 5.4997821697278155], "isController": false}, {"data": ["https://www.banglapuzzle.com/services", 300, 1, 0.3333333333333333, 17216.88999999999, 14090, 23324, 17135.0, 19877.9, 20241.9, 21060.9, 6.760563380281691, 676.7023547535211, 7.948767605633803], "isController": false}, {"data": ["https://www.banglapuzzle.com/contact", 300, 0, 0.0, 17721.580000000005, 10421, 23619, 17045.0, 21509.600000000002, 21900.15, 23064.420000000002, 3.424696628956952, 320.0877542837247, 4.036727374170938], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/softwareites", 300, 1, 0.3333333333333333, 18862.16000000001, 13160, 27678, 18832.5, 22102.600000000002, 22805.7, 26591.68, 4.944212798918866, 459.63951538474214, 5.875743048230796], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/government-defense", 300, 1, 0.3333333333333333, 11172.773333333333, 4806, 34849, 9864.5, 16631.9, 20842.09999999999, 30811.08000000003, 4.341785342132685, 405.6215859320727, 5.185168664792462], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 300, 0, 0.0, 17477.94, 12365, 25313, 19318.5, 21526.7, 22056.55, 24107.40000000001, 5.677624481916766, 529.7468341329321, 6.758812737750525], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, 100.0, 0.09090909090909091], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3300, 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.banglapuzzle.com/services", 300, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/softwareites", 300, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/government-defense", 300, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
