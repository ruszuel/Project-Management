import { React, useState, useEffect } from "react";
import { useTask, useAuth } from "../Context";
import { RiAdminLine, RiUserLine } from "@remixicon/react"
import axios from "axios";

const ItemIcon = (props) => {
  const [members, setMembers] = useState([])
  const { data } = useAuth()
  const { project } = useTask()

  const retrieveData = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/retrieve_mem_proj", {projectID: project});
  
      const taskRes = await axios.post("http://127.0.0.1:8000/api/tasks", {
        project: project,
      });
  
      if (res.status === 200 && taskRes.status === 200) {
        const membersData = res.data; 
        const tasks = taskRes.data;
  
        const calculatedMembers = membersData.map((member) => {
          const assignedTasks = tasks.filter((t) => t.assigned === member.username);
          const completedTasks = assignedTasks.filter((t) => t.status === "Completed");
  
          const progress =
            assignedTasks.length > 0
              ? Math.round((completedTasks.length / assignedTasks.length) * 100)
              : 0;
  
          return { ...member, progress };
        });

        const managerData = {
          username: data.username,
          role: "manager",
          progress: 100,
        };
  
        setMembers([managerData, ...calculatedMembers]);
      }
    } catch (err) {
      console.error("Error fetching members or tasks:", err);
    }
  };
  
  useEffect(() => {
      retrieveData();
  
  }, [project]);

  return (
    <div className="flex flex-col gap-3 px-5 py-3">
      {members.length === 0 ? (
        <p className="text-gray-500">No members found</p>
      ) : (
        members.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-x-3 py-2"
          >
            {member.role === "manager" ? (
              <RiAdminLine size={props.size} color="#1a2d42" />
            ) : (
              <RiUserLine size={props.size} color="#1a2d42" />
            )}
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{member.username}</p>
              <p className="text-xs text-gray-500">
                {member.role === "manager"
                  ? "Project Manager"
                  : "Project Member"}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 flex-1 ml-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${member.progress || 0}%` }}
              ></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ItemIcon;
