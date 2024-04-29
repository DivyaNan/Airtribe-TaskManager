const express = require('express');
const app = express();
const port = 3000;
const taskData = require('./task.json');
const Validator = require('./validator');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get all tasks
app.get('/tasks',async (req, res) => {
    
        if (Validator.validateTaskInfo(taskData).status == true) { 
        return res.status(500).json({ error: "Task data is not available" });
    }
    
        return await res.status(200).json(taskData);
    
  
})

//get task by Id
app.get('/tasks/:id', (req, res) => {
    try {
        let tasks = taskData.tasks;
       // console.log(tasks)
        let taskIdPassed = req.params.id;
        let filteredTask = tasks.filter(val => val.id == taskIdPassed);
        console.log(filteredTask)
         // Define the expected pattern for a task object
         const mustMatchTaskPattern = {
            id: Number,
            title: String,
            description: String,
            completed: Boolean
        };
        if(filteredTask.length == 0) {
            return res.status(404).json("No appropriate task found with the provided task id");
        }
          // Match the response body against the expected pattern
         console.log( Validator.matchesPattern(filteredTask, mustMatchTaskPattern)
                 )
                         if (Validator.matchesPattern(filteredTask, mustMatchTaskPattern == true)) {
            return  res.status(200).json(filteredTask);
        }
            else{
                let message = Validator.validateTaskInfo(filteredTask).message;
                return res.status(500).send(message);
          
        }
     
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong while processing the request");
    }
});

//create a task
app.post('/tasks', (req, res) => {
    const userProvidedDetails = req.body;
    console.log(userProvidedDetails);
    let taskDataModified = taskData;
    taskDataModified.tasks.push(userProvidedDetails);
    if (Validator.validateTaskInfo(userProvidedDetails).status == true) { 
        fs.writeFile('./tasks.json', JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while creating the course");
            } else {
                return res.status(201).send("Successfully created the task");
            }
        });
    } else {
        let message = Validator.validateTaskInfo(userProvidedDetails).message;
        return res.status(400).send(message);
    }
});

//update a task
//update a task
app.put('/tasks/:id/', (req, res) => {
    const userProvidedDetails = req.body;
    console.log(userProvidedDetails);
    let modifiedTaskData = taskData;
    let taskIdPassed = req.params.id;
    console.log(taskIdPassed);
    let index = modifiedTaskData.tasks.findIndex(val => val.id == taskIdPassed);
    
    //console.log(filteredTaskData)
    if (index === -1) {
        return res.status(404).json("No appropriate task found with the provided task id");
    }

    taskData[index] = { ...taskData[index], ...userProvidedDetails };
   // taskDataModified.tasks.push(userProvidedDetails);
    if (Validator.validateTaskInfo(userProvidedDetails).status == true) { 
        fs.writeFile('./tasks.json', JSON.stringify(taskData), {encoding: 'utf8', flag:'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while updating the course");
            } else {
                return res.status(200).send("Successfully updated the task");
            }
        });
    } else {
        let message = Validator.validateTaskInfo(userProvidedDetails).message;
        return res.status(400).send(message);
    }
});

//delete taskid

app.delete('/tasks/:id',async (req, res) => {
    try {
        let tasks = taskData.tasks;
        console.log(tasks)
        let taskIdPassed = req.params.id;
        let index = taskData.tasks.findIndex(val => val.id == taskIdPassed);
    
        //console.log(filteredTaskData)
        if (index === -1) {
            return res.status(404).json("No appropriate task found with the provided task id");
        }
    
        // Remove the task from the array
        taskData.tasks.splice(index, 1);
        console.log(taskData)
        // Write the updated data back to the JSON file
         fs.writeFile('./tasks.json', JSON.stringify(taskData, null, 2), { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Something went wrong while deleting the task");
        } else {
            return res.status(200).send();
        }
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong while processing the request");
    }
});


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;