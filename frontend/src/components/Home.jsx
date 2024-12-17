import React, { useState,useEffect } from 'react';
import DoughnutChart from '../reusable/DoughnutChart';
import ItemIcon from '../reusable/ItemIcon';
import { useTask,useAuth } from '../Context';
import { useNavigate } from 'react-router-dom';
import GantChart from '../reusable/GantChart';
import { RiEditLine, RiDeleteBinLine } from '@remixicon/react';
import axios from 'axios';


const Home = () => {
  const navigate = useNavigate()
  const [isEditable, setIsEditable] = useState(false)
  const { project } = useTask()
  const { data } = useAuth()
  const [description, setDescription] = useState('')

  useEffect(() => {
    get_project_description()
  }, [project]);

  const handleEditToggle = () => {
    if (isEditable) {
      updateProjectDescription();
    }
    setIsEditable(!isEditable);
  };
  const get_project_description = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/retrieve_project_description', {
        project_id: project, 
      });
  
      setDescription(response.data.project_description);  
    } catch (err) {
      console.error("Error fetching project description:", err);
    }
  };
  
  const updateProjectDescription = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/update_description', {
        project_id: project,
        project_description: description,
      });
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className='flex w-full h-screen p-5 font-poppins bg-gray-300 relative flex-col gap-4'>
      <div className='flex flex-row gap-4 flex-1'>

        <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-8 h-full flex flex-col'>
          <div className='flex flex-row items-center justify-between'>
            <p className='font-semibold text-xl'>Project Description</p>
          </div>
          <div className='flex h-full mt-5'>
            <textarea className={`w-full p-3 text-sm focus:outline-none disabled:text-gray-400 ${data.role === 'member' ? 'border-none' : 'border border-gray-400 rounded-md'}`}       
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isEditable}
            ></textarea>
          </div>
          <div className='flex flex-row ml-auto p-4 gap-4'>
            <button className={`bg-[#1A2D42] text-white text-sm p-3 gap-1 rounded-md flex items-center' ${data.role === 'manager' ? '' : 'hidden'}`} onClick={handleEditToggle} >
              <RiEditLine size={18} color='white' />
              {isEditable ? "Save" : "Edit"}
            </button>
            <button className={`bg-red-500 border-[#1A2D42] text-white text-sm p-3 gap-2 rounded-md flex items-center' ${data.role === 'manager' ? '' : 'hidden'}`}>
              <RiDeleteBinLine size={18} color='white' /> Delete Project
            </button>
          </div>
        </div>

        <div className='flex w-[40%] bg-white rounded-lg shadow-md p-10 py-8 h-full flex flex-col'>
          <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-between'>
              <p className='font-semibold text-xl'>Project Progress</p>
              <p className='font-normal text-xs text-cyan-600 opacity-60 hover:underline cursor-pointer' onClick={() => navigate('/task')}>
                See all
              </p>
            </div>
            <div className='flex items-center justify-center'>
              <DoughnutChart />
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-row gap-4 flex-1'>
        <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-8 h-full flex-row'>
          <div className='flex flex-row items-center justify-between'>
            <p className='font-semibold text-xl'>Project Schedule</p>
            <p className='font-normal text-xs text-cyan-600 opacity-60 hover:underline cursor-pointer' onClick={()=>navigate('/projectschedule')}>See all</p>
          </div>
          <div className='w-[110vh] overflow-y-auto h-[30vh] mt-5'>
            <GantChart size="105vh" width={70}/>
          </div>
        </div>

        <div className='flex w-[30%] bg-white rounded-lg shadow-md p-10 py-8 h-full flex flex-col'>
          <div className='flex flex-row items-center justify-between'>
            <p className='font-semibold text-xl'>Team Members</p>
            <p className='font-normal text-xs text-cyan-600 opacity-60 hover:underline cursor-pointer' onClick={()=>navigate('/members')}>See all</p>
          </div>
          <div className='overflow-y-auto h-[94%]'>
            <ItemIcon size={'35'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
