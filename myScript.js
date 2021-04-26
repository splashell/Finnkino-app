// Add on-load event listener to call functions to populate the "theater" and "date" selections.
window.addEventListener('load', getTheaters);
document.getElementById("submit").addEventListener("click", getSchedule);

//Get reference to date list, theater list and output div.
let dateList = document.getElementById("dates");
let theaterList = document.getElementById("theaters");
let output = document.getElementById('output');


/*This function first calls the getDates function to populate Date list, and then populates the Theater list through Finnkino XML-services. */
function getTheaters(){
    // Call getDates first, populate Dates list.
    getDates()

    // XHTTP request for Theatre areas.
    var xhttp = new XMLHttpRequest();
    var url = 'https://www.finnkino.fi/xml/TheatreAreas/';
    xhttp.open('GET', url)

    xhttp.send();
    let theaterResponse;

    // Wait to get proper response.
    xhttp.onreadystatechange=function(){ if(xhttp.status == 200 && xhttp.readyState == 4){
        theaterResponse = xhttp.responseXML;
        /* For every TheatreArea tag, get theatre value ('id') and name from XML response. Create option element (part of select list), set their innerHTML
        and value attributes, and append to the "select" list.*/
        for (i=0; i < theaterResponse.getElementsByTagName('TheatreArea').length; i += 1){
            let theatreValue = theaterResponse.getElementsByTagName('ID')[i].childNodes[0].nodeValue
            let theatreName = theaterResponse.getElementsByTagName('Name')[i].childNodes[0].nodeValue;
            let option = document.createElement('option');
            option.innerHTML = theatreName;
            option.setAttribute('value', theatreValue);
            theaterList.appendChild(option);
        }
    }
}
}
/*Function to get dates from Finnkino XML service and append them to the date (select type) list.*/
function getDates(){

    // XHTTP Request for available dates.
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://www.finnkino.fi/xml/ScheduleDates/');
    xhttp.send();

    let dateResponse;

    // Wait to get proper response.
    xhttp.onreadystatechange=function(){ if(xhttp.status == 200 && xhttp.readyState == 4) {
        dateResponse = xhttp.responseXML;
        /* Get all dates from XML response, modify them to include only yyyy-dd-mm. 
        Create option element, set innerHTML to date and append to Date List (select type).*/
        for (i=0; i < dateResponse.getElementsByTagName('dateTime').length; i += 1){
            let date = dateResponse.getElementsByTagName('dateTime')[i].childNodes[0].nodeValue;
            date = date.substring(0, 10);
            let option = document.createElement('option');
            option.innerHTML = date;
            
            dateList.appendChild(option);
        }
    }
}
}

/*Function to build FinnKino XML API request from user input (theatre and date). Then */
function getSchedule(){
    let selectedDate = dateList.value;
    let selectedTheater = theaterList.value;
    let selectedDateDot = selectedDate.substring(8) + "." + selectedDate.substring(5,7) + "." + selectedDate.substring(0,4);
    console.log('selectedTheater in getSchedule: ' + selectedTheater);
    let url = ("https://www.finnkino.fi/xml/Schedule/?&area=" + selectedTheater + "&dt=" + selectedDateDot);
    console.log('Url: ' + url);
    console.log('selectedDate in getSchedule: ' + selectedDate);
    console.log('SelectedDateDot:' + selectedDateDot);
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', url);
    xhttp.send();

    // When response ready:
    xhttp.onreadystatechange=function(){ if(xhttp.status == 200 && xhttp.readyState == 4){
        let scheduleResponse = xhttp.responseXML;
        console.log(scheduleResponse);

        // Create Table, table row and 'td' elements for headers.
        let table = document.createElement("TABLE");
        let headerRow =  document.createElement("tr");
        let startHeader = document.createElement("td");
        let endHeader = document.createElement("td");
        let titleHeader =  document.createElement("td");
        let productionYearHeader =  document.createElement("td");
        let genreHeader =  document.createElement("td");
        let imageHeader = document.createElement("td");

        // Set header HTML, append td's into tr, and tr into table.
        startHeader.innerHTML = "Start time";
        endHeader.innerHTML = "End time";
        titleHeader.innerHTML = "Title";
        productionYearHeader.innerHTML = "Production year";
        genreHeader.innerHTML = "Genre";
        imageHeader.innerHTML = "Movie Image";
        headerRow.appendChild(startHeader);
        headerRow.appendChild(endHeader);
        headerRow.appendChild(titleHeader);
        headerRow.appendChild(productionYearHeader);
        headerRow.appendChild(genreHeader);
        headerRow.appendChild(imageHeader);
        table.appendChild(headerRow);
        console.log(table);

        for (i=0; i< (scheduleResponse.getElementsByTagName('Show').length); i += 1){
            // Save values from appropriate XML response tags.

            let startTime = scheduleResponse.getElementsByTagName('Show')[i].childNodes[5].innerHTML;
            let endTime = scheduleResponse.getElementsByTagName('Show')[i].childNodes[9].innerHTML;
            let title = scheduleResponse.getElementsByTagName('Show')[i].childNodes[31].innerHTML;
            let productionYear = scheduleResponse.getElementsByTagName('Show')[i].childNodes[35].innerHTML;
            let genre = scheduleResponse.getElementsByTagName('Show')[i].childNodes[49].innerHTML;
            let img = scheduleResponse.getElementsByTagName('Show')[i].childNodes[73].childNodes[1].innerHTML;
            
            // Fix start and end time format.
            startT = startTime.substring(0, 10) + " " + startTime.substring(11,);
            endT = endTime.substring(0, 10) + " " + endTime.substring(11,);

            // Create row and td elements for the values.

            let row = document.createElement("tr");
            let start_ = document.createElement("td");
            let end_ = document.createElement("td");
            let title_ =  document.createElement("td");
            let productionYear_ =  document.createElement("td");
            let genre_ =  document.createElement("td");
            let img_ = document.createElement("img");
            img_.setAttribute('src', img);
            let image_ = document.createElement('td');
            image_.appendChild(img_);
        

            // Save values into 'td' elements.
            start_.innerHTML = startT;
            end_.innerHTML = endT;
            title_.innerHTML = title;
            productionYear_.innerHTML = productionYear;
            genre_.innerHTML = genre;
        
            // Append td's into current row, and row into the table.
            row.appendChild(start_);
            row.appendChild(end_);
            row.appendChild(title_);
            row.appendChild(productionYear_);
            row.appendChild(genre_);
            row.appendChild(image_);
            table.appendChild(row);
        }
        // Create H2 element and set description. Append H2 and table elements to the output.
        let forDate = document.createElement('h2');
        forDate.innerHTML = theaterList.options[theaterList.selectedIndex].text + ": " + selectedDate;
        output.appendChild(forDate);
        output.appendChild(table);
    }
        
    }
  

}
       
        
    
