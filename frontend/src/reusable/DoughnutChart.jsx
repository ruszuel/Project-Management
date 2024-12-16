import { useState, React, useEffect } from "react";
import { useTask } from "../Context";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = () => {
  const [taskData, setTaskData] = useState([])
  const [taskCounts, setTaskCounts] = useState({
    NotStarted: 0,
    Ongoing: 0,
    Pending: 0,
    Completed: 0,
  })

  const { project } = useTask();
  

  const retrieveData = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/tasks", {
        project: project.project_id,
      });

      const tasks = res.data;

      // Count tasks by their status
      const counts = {
        NotStarted: tasks.filter((t) => t.status === "Not started").length,
        Ongoing: tasks.filter((t) => t.status === "Ongoing").length,
        Pending: tasks.filter((t) => t.status === "Pending").length,
        Completed: tasks.filter((t) => t.status === "Completed").length,
      };

      setTaskData(tasks)
      setTaskCounts(counts)
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {
    if (project?.project_id) {
      retrieveData();
    }
  }, [project]);

  const data = {
    labels: ["Not Started", "Ongoing", "Pending", "Completed"],
    datasets: [
      {
        data: [
          taskCounts.NotStarted,
          taskCounts.Ongoing,
          taskCounts.Pending,
          taskCounts.Completed,
        ],
        backgroundColor: ["#F87171", "#3B82F6", "#FBBF24", "#22C55E"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "60%",
  };

  return (
    <div className="flex justify-center items-center">
        {taskData.length===0 ? (<p className="text-gray-300">No Data Available</p>):(<Doughnut data={data} options={options}/>)}
    </div>
  );
};

export default DoughnutChart;
