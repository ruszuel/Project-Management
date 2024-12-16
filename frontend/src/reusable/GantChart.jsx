import React, { useState, useEffect } from 'react';
import { useTask } from '../Context';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import axios from 'axios';

const GanttChart = ({ size, width }) => {
  const { project } = useTask();
  const [taskData, setTaskData] = useState([

    
]);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/tasks', {project: project});
        {/*format ng data para mapakain sa gantt chart*/}
        const formattedTasks = res.data.map((t) => ({
            start: new Date(t.starting_date),
            end: new Date(t.deadline),
            name: t.feature,
            id: `Task${t.task_id}`,
            styles: t.status === "Completed" ? {
              backgroundColor: '#4CAF50',
              backgroundSelectedColor: '#4CAF50', 
            } : t.status === "Ongoing" ? {
              backgroundColor: '#2196F3',
              backgroundSelectedColor: '#2196F3',
            } : t.status === "Pending" ? {
                backgroundColor: '#FF9800',
                backgroundSelectedColor: '#FF9800', 
            } : t.status == "Not started"? {
                backgroundColor: '#9E9E9E',
            } : {}
          }));
        setTaskData(formattedTasks);
      } catch (err) {
        console.error(err)
      }
    };

        retrieveData();
        
    }, [project]);

    {/*update start and deadline after maghover*/}
  const handleTaskChange = async (task) => {
    try {
      await axios.put('http://127.0.0.1:8000/api/update_date_gant', {
        task_id: task.id.replace('Task', ''), 
        starting_date: task.start.toISOString().split('T')[0], 
        deadline: task.end.toISOString().split('T')[0], 
        feature: task.name,
      });
  
      const updatedTasks = taskData.map((t) => (t.id === task.id ? task : t));
      setTaskData(updatedTasks);
    } catch (err) {
        console.error(err)
      }
  };
  

  if (taskData.length === 0) {
    return <p className="text-gray-300 flex justify-center">No Data Available</p>;
  }

  return (
    <div style={{ width: size }}>
      <Gantt
        tasks={taskData}
        viewMode={ViewMode.Week}
        onDateChange={handleTaskChange}
        listCellWidth="17vh"
        fontFamily="Poppins, sans-serif"
        columnWidth={width}
      />
    </div>
  );
};

export default GanttChart;
