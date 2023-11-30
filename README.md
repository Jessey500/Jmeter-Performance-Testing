# Content
- [Load testing Report](https://github.com/Jessey500/Jmeter-Performance-Testing#load-testing-report)
- [Load testing Report](https://github.com/Jessey500/jmeter-perfomance-testing#Summary)
- [Introduction](https://github.com/imranhasanraaz/jmeter-perfomance-testing#introduction)  
- [Install](https://github.com/imranhasanraaz/jmeter-perfomance-testingstall)      
- [Prerequisites](https://github.com/imranhasanraaz/jmeter-perfomance-testing#prerequisites)
- [Elements of a Minimal Test Plan](https://github.com/imranhasanraaz/jmeter-perfomance-testing#Elements-of-a-minimal-test-plan)    
- [Test Plan](https://github.com/imranhasanraaz/jmeter-perfomance-testing#test-plan)
- [Collection of API](https://github.com/imranhasanraaz/jmeter-perfomance-testing#collection-of-api)   
- [List of API](https://github.com/imranhasanraaz/jmeter-perfomance-testing#list-of-api) 
- [Load the JMeter Script](https://github.com/imranhasanraaz/jmeter-perfomance-testing#load-the-jmeter-script)
- [Make jtl File](https://github.com/imranhasanraaz/jmeter-perfomance-testing#make-jtl-file)  
- [Make html File](https://github.com/imranhasanraaz/jmeter-perfomance-testing#make-html-file)  
- [HTML Report](https://github.com/imranhasanraaz/jmeter-perfomance-testing#html-report) 

# Load testing Report

| Concurrent Request  | Loop Count | Avg TPS for Total Samples  | Error Rate | Total Concurrent API request |
|               :---: |      :---: |                      :---: |                        :---: |      :---: |
| 200  | 1  | 11  | 0%      | 2200   |
| 250  | 1  |  9.5     | 0%      | 2750   |
| 300  | 1  |  12    | 0.09%   | 3300   |


### Summary
- While executed 300 concurrent request, found  3 request got connection timeout and error rate is 0.09%.
- Server can handle almost concurrent 250 API call with almost zero (0) error rate.


# Introduction

This document explains how to run a performance test with JMeter against as https://www.banglapuzzle.com/.


# Prerequisites
- As of JMeter 5.6, Java 8 and above are supported.
- we suggest  multicore cpus with 4 or more cores.
- Memory 16GB RAM is a good value.


# Elements of a minimal test plan
- Thread Group

    The root element of every test plan. Simulates the (concurrent) users and then run all requests. Each thread simulates a single user.

- HTTP Request Default (Configuration Element)

- HTTP Request (Sampler)

- Summary Report (Listener)

# Test Plan

Testplan > Add > Threads (Users) > Thread Group (this might vary dependent on the jMeter version you are using)

- Name: Users
- Number of Threads (users): 200 to 300
- Ramp-Up Period (in seconds): 1
- Loop Count: 1

  1) The general setting for the tests execution, such as whether Thread Groups will run simultaneously or sequentially, is specified in the item called Test Plan.

  2) All HTTP Requests will use some default settings from the HTTP Request, such as the Server IP, Port Number, and Content-Encoding.

  3) Each Thread Group specifies how the HTTP Requests should be carried out. To determine how many concurrent "users" will be simulated, one must first know the number of threads. The number of actions each "user" will perform is determined by the loop count.

  4) The HTTP Header Manager, which allows you to provide the Request Headers that will be utilized by the upcoming HTTP Requests, is the first item in Thread Groups.

# Collection of API

- Run BlazeMeter  
- Collect Frequently used API  
- Save JMX file then paste => **apache-jmeter-5.6.2\bin**

    ### List of API 

    - [https://www.banglapuzzle.com/products](https://www.banglapuzzle.com/products)
    - [https://www.banglapuzzle.com/services](https://www.banglapuzzle.com/services)
    - [https://www.banglapuzzle.com/industry/healthcare](https://www.banglapuzzle.com/industry/healthcare)
    - [https://www.banglapuzzle.com/industry/softwareites](https://www.banglapuzzle.com/industry/softwareites)
    - [https://www.banglapuzzle.com/industry/rmg-sector](https://www.banglapuzzle.com/industry/rmg-sector)
    - [https://www.banglapuzzle.com/industry/government-defense](https://www.banglapuzzle.com/industry/government-defense)
    - [https://www.banglapuzzle.com/about](https://www.banglapuzzle.com/about)
    - [https://www.banglapuzzle.com/career](https://www.banglapuzzle.com/career)
    - [https://www.banglapuzzle.com/contact](https://www.banglapuzzle.com/contact)
    - [https://www.banglapuzzle.com/hire](https://www.banglapuzzle.com/hire)
    - [ https://www.banglapuzzle.com/hire/subcategory-flutter]( https://www.banglapuzzle.com/hire/subcategory-flutter)

   **OR**
    
  ### Load the JMeter Script 
   - File > Open (CTRL + O)
   - Locate the "BanglaPuzzle-300.jmx" file contained on this repo
   - Continue open BanglaPuzzle-200.jmx to BanglaPuzzle-300.jmx
   - Open those file
   - The Test Plan will be loaded
//![loadjmx](<img src="Image/SS-1.png">)
[Capture](<img src="Image/SS-1.png">)


# Test execution (from the Terminal)
 
- JMeter should be initialized in non-GUI mode.
- Make a report folder in the **bin** folder.  
- Run Command in __jmeter\bin__ folder.

 ### Make jtl file

```bash
  jmeter -n -t  BanglaPuzzle-300.jmx -l BanglaPuzzle-300.jtl
```      
  Then continue to upgrade Threads(200 to 300) by keeping Ramp-up Same.   

After completing this command  
   ### Make html file   
  
  ```bash
  jmeter -g Banglapuzzle-300.jtl -o report\Banglapuzzle-300.html
```
  - **g**: jtl results file

  - **o**: path to output folder
  - \
    ![Capture](<img src="Image/SS-2.png">)  

# HTML Report

**Number of Threads 200 ; Ramp-Up Period 1s**

Requests Summary             |  Errors
:-------------------------:|:-------------------------:
<img src="Image/SS-3.png">  |  <img src="Image/SS-5.png">

**Number of Threads 250 ; Ramp-Up Period 1s**
   
Requests Summary             |  Errors
:-------------------------:|:-------------------------:
<img src="Image/SS-3.png"> |  <img src="Image/SS-6.png">

**Number of Threads 300 ; Ramp-Up Period 1s**
   
Requests Summary             |  Errors
:-------------------------:|:-------------------------:
<img src="Image/SS-7.png">  |  <img src="Image/SS-8.png">
