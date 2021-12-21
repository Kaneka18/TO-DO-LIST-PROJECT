$(window).on('load', function() {
    // $("#addTaskContainer").css("display", "none"); //can be added in css
    $(".task-duedate").each(function() {
        var date= $(this)[0].innerHTML;
        // updateDate(date,$(this).siblings(".date"));
        $(this).siblings(".date").html(getFormattedDate(date,"longDate"));
    });
    var refreshDate= new Date();
    $('.lastUpdateDate')[0].innerHTML=getFormattedDate(refreshDate, "shortDate");

    $('.year')[0].innerHTML=refreshDate.getFullYear();
});

//in js
/*
window.onload = function() {
    document.querySelector("#addTaskContainer").style.display = 'none'; //can be added in css
};
 document.querySelector("#addTaskBtn").addEventListener("click", (event) => {
    let addTaskContainer = document.querySelector("#addTaskContainer"); // getElementById can also be used

    if (addTaskContainer.style.display === "none") {
        addTaskContainer.style.display = "block";
        event.target.innerHTML = "Close X";
        event.target.style.backgroundColor = "IndianRed";
    } else {
        addTaskContainer.style.display = "none";
        event.target.innerHTML = "Add Task +";
        event.target.style.backgroundColor = "plum";
    }
}); 
*/

function getFormattedDate(date, formatType){   // return formatted date
    let newDate = new Date(date);
    var dateText = newDate.getDate();
    var monthText = getMonthName(newDate.getMonth());
    var yearText = newDate.getFullYear();
    var hoursText = newDate.getHours();
    var minutestText = newDate.getMinutes();
    hoursText= hoursText<10?"0"+hoursText:hoursText;
    minutestText= minutestText<10?"0"+minutestText:minutestText;
    if(formatType=="longDate"){
       var time= "am";
       if(hoursText>12){
          hoursText= hoursText-12;
          time ="pm";
       }
       else if(hoursText==0){
          hoursText= 12;
       }
       var suffix ="th";
       if(dateText == 1 || dateText == 21 || dateText == 31){
          suffix= "st";
       }
       else if(dateText == 2 || dateText == 22){
          suffix= "nd";
       }
      else if(dateText == 3 || dateText == 23){
          suffix= "rd";
      }
    //var datePostfix = dateText == "1" || dateText == "21" || dateText == "31" ? "st" : dateText == "2" || dateText == "22" ? "nd" : dateText == "3" || dateText == "23" ? "rd" : "th";
      var formattedDate = dateText+ suffix+ " "+ monthText+ " "+ yearText+ " "+
                         "at"+ " "+ hoursText+ ":"+ minutestText+ " "+ time;
    }
    else{
       var secondsText = newDate.getSeconds();
       var monthText = newDate.getMonth() +1;
       secondsText= secondsText<10?"0"+secondsText:secondsText;
       var formattedDate = dateText + "/" +monthText+ "/"+yearText+", "+hoursText+":"+minutestText+":"+secondsText;
    }
   return formattedDate;
}

function getMonthName(month){
    switch(month){
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
    }
}
       
$(".fa-sync-alt").on("click",function(event){
    $.ajax({
        type: "GET",
        url: "/refreshTasks",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus, jqXHR) {
            alert("Refreshed tasks successfully.");
            if (data.length >0){ 
                 $('.rows').remove();
                 $.each(data, function(i, obj) {
                    var date = obj.dueDate;
                    var formattedDate= getFormattedDate(date, "longDate");
                    var setAsImportantClass = obj.setAsImportant ? "add-important" : ""; 
                    var taskElement =$('<div id ="'+ obj.taskId + '" class="rows '+ setAsImportantClass + 
                     '"> <h2> <span class="task-name">'+ obj.taskName + '</span> <span id="deleteBtn_'+ obj.taskId +
                     '" class="delete-btn"> <i class="fas fa-times"></i> </span> <span id="updateBtn_'+ obj.taskId +
                     '" class="update-btn"> <i class="fas fa-pencil-alt"></i> </span> </h2> <p class="date">'+ formattedDate +
                     '</p> <p class="task-duedate" hidden>'+ obj.dueDate +'</p> </div>');

                    $("#tasksContainer").append(taskElement);

                    taskElement.find(".delete-btn").on("click", function() { //find finds child elements (not parent) [deletes task]
                     deleteTask($(this));
                    });

                    taskElement.find(".update-btn").on("click", function() { //find finds child elements (not parent) [deletes task]
                     updateTask($(this));
                    });
                 });
 
                var noTaskContainer = $('#no-task');
                if (noTaskContainer.is(":visible")) {   //can make var of class  //for hiding the no task container
                    noTaskContainer.remove();
                }
            }
            else{ 
               $('.rows').remove();
               var noTaskContainer = $('#no-task');
               if (!noTaskContainer.is(":visible")){
                  var noRecordFound= $('<div id="no-task"> <h4> No Record Found </h4> </div>');
                  $("#tasksContainer").append(noRecordFound);
                  //   noTaskContainer.show();
               }
            }
            var refreshDate= new Date();
            $('.lastUpdateDate')[0].innerHTML=getFormattedDate(refreshDate, "shortDate");
        },
        error: function(err) {
            alert(err);
        }
    })
});


$("#addTaskBtn").on("click", function(event) {
    let addTaskContainer = $("#addTaskContainer");
    var addBtn = $(this);
    var submitBtn = $("#submitBtn");

    if (!addTaskContainer.is(":visible")) { //can use is visible here
        showAddUpdateTaskContainer();
        submitBtn.html('Save Task');
        submitBtn.data("submitMode","Save");
        // addTaskContainer.css("display", "block"); // same as show()
        // addBtn.html('Close X');
        // addBtn.css("backgroundColor", "IndianRed");
    } else {
        addTaskContainer.hide();
        addBtn.html('Add Task +');
        addBtn.css("backgroundColor", "#98FB98");
        $('#taskForm').each(function() {
                    this.reset();
        });
    }
});

/**
 * Handle 'Save Task' submit button click to save task in database.
 */
$("#taskForm").on("submit", function(event) {
    event.preventDefault();
     
    if($("#submitBtn").data("submitMode")==="Save"){
     var data = {
        taskName: $("#taskName").val(),
        dueDate: $("#dueDate").val(),
        setAsImportant: $("#setAsImportant").is(":checked")
    };
    data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        data: data,
        url: "/addTask",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus, jqXHR) { //response after ajax call
            if (jqXHR.status == "200") {
                alert("Task added successfully.");
                // $(this).each(function() {   //reset- alternate
                // this.reset();
                // })
                // $("#taskForm")[0].reset();
                $('#taskForm').each(function() {
                    this.reset();
                });
                var setAsImportantClass = data.setAsImportant ? "add-important" : "";
                var date = data.dueDate;
                var formattedDate= getFormattedDate(date, "longDate");
                var taskElement = $('<div id ="' + data.taskId + '" class="rows ' + setAsImportantClass + '"> <h2> <span class="task-name">'+ data.taskName +
                '</span> <span id="deleteBtn_' + data.taskId + '" class="delete-btn"> <i class="fas fa-times"> </i> </span> <span id="updateBtn_' + data.taskId +
                '" class="update-btn"> <i class="fas fa-pencil-alt"> </i> </span> </h2> <p class="date">' + formattedDate + '</p> <p class="task-duedate" hidden>'+ data.dueDate + 
                '</p> </div>');

                $("#tasksContainer").append(taskElement);

                //adding event for new records
                taskElement.find(".delete-btn").on("click", function() { //find finds child elements (not parent) [deletes task]
                    deleteTask($(this));
                });

                taskElement.find(".update-btn").on("click", function() { //find finds child elements (not parent) [deletes task]
                    updateTask($(this));
                });

                var noTaskContainer = $('#no-task');
                if (noTaskContainer.is(":visible")) {   //can make var of class  //for hiding the no task container
                    noTaskContainer.remove();
                }

            } else {
                alert(data);
            }
        },
        error: function(err) {
            alert(err);
        }
     });
    }
    else {                                          //update part 
       var submitBtn= $("#submitBtn");
       var data = {
        taskName: $("#taskName").val(),
        dueDate: $("#dueDate").val(),
        setAsImportant: $("#setAsImportant").is(":checked"),
        taskId : submitBtn.data("taskId")
    };
    data = JSON.stringify(data);
    $.ajax({
        type: "PUT",
        data: data,
        url: "/updateTask",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus, jqXHR) {       //response after ajax call
            if (jqXHR.status == "200") {
                alert("Task updated successfully.");
                // $(this).each(function() {        //reset- alternate
                // this.reset();
                // })
                // $("#taskForm")[0].reset();
                $('#taskForm').each(function() {
                    this.reset();
                });
               submitBtn.html('Save Task');
               submitBtn.data("submitMode","Save");

               var date = data.dueDate;
               $("#"+ $.escapeSelector(data.taskId)).children().children()[0].innerHTML = data.taskName;
               $("#"+ $.escapeSelector(data.taskId)).children()[1].innerHTML = getFormattedDate(date, "longDate");

               // if( $("#"+ $.escapeSelector(data.taskId)).hasClass("add-reminder"))
               if(data.setAsImportant){
                  $("#"+ $.escapeSelector(data.taskId)).addClass("add-important");
               }
               else{
                  $("#"+ $.escapeSelector(data.taskId)).removeClass("add-important");
               }
            } 
            else {
                alert(data);
            }
        },
        error: function(err) {
            alert(err);
        }
     });
    }
});

$(".delete-btn").on("click", function() {   //adding event for existing records (for loading event on page refresh everytime)
    deleteTask($(this));
});

function deleteTask(deleteElement) {
    var taskId = deleteElement.attr("id").split('_').pop(); //this points to clicked element (span here) //split is used to add elements in array
    var data = {
        taskId: taskId
    };
    data = JSON.stringify(data); //app.js expects string
    $.ajax({
        type: "POST",
        data: data,
        url: "/deleteTask",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus, jqXHR) { //response after ajax call
            if (jqXHR.status == "200") {
                alert("Task deleted successfully."); //sync func
                $("#deleteBtn_" + $.escapeSelector(data)).parent().parent().remove(); //deleteId is accessed coz of jquery can access any element any time from ui in DOM(HTML hierarchy)
                if ($('.rows').length == 0) {
                  // $('#no-task').show();
                  var noRecordFound= $('<div id="no-task"> <h4> No Record Found </h4> </div>');
                  $("#tasksContainer").append(noRecordFound);
                }
            } else {
                alert(data);
            }
        },
        error: function(err) {
            alert(err);
        }
    })
}
   
$(".update-btn").on("click", function() { //adding event for existing records (for loading event on page refresh everytime)
    updateTask($(this));
});

function updateTask(updateElement) {
    var data = {
        taskName : updateElement.siblings('.task-name')[0].innerHTML,
        dueDate : updateElement.parent().siblings('.task-duedate')[0].innerHTML,
        setAsImportant : updateElement.parent().parent().hasClass("add-important"),
        taskId : updateElement.attr("id").split('_').pop()
    };
    showAddUpdateTaskContainer(data);
}

function showAddUpdateTaskContainer(data) {     //optional to send parameter :data
    let addTaskContainer = $("#addTaskContainer");
    var addBtn = $("#addTaskBtn");
    var submitBtn = $("#submitBtn");
    var setAsImportant = $('#setAsImportant');

    addTaskContainer.show();
    addBtn.html('Close X');
    addBtn.css("backgroundColor", "IndianRed");
    if(data){
     $('#taskName').val(data.taskName);
     $('#dueDate').val(data.dueDate);
     if(data.setAsImportant){
         setAsImportant.prop('checked', true);
     }
     else{
         setAsImportant.prop('checked', false);
     }
     submitBtn.html('Update Task');
     submitBtn.data("submitMode","Update");
     submitBtn.data("taskId",data.taskId);
    } 
}

// if(true){
//     const tree= "apple";
//      tree="mango";
// }

// if(true){
//     // console.log(tree);
// }