import React from "react";
import GantChart from "../reusable/GantChart";



const ProjectSchedule = () =>{
    return(

        <div className='flex w-full h-screen p-5 font-poppins bg-gray-300 relative flex-col gap-4'>
            <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-8 h-full flex-row'>
                <div>
                    <p className='font-semibold text-2xl'>Project Schedule</p>
                    <p className='text-gray-400'>Here's the schedule visual representation of the project!</p>
                </div>
                <div className='w-[160vh] overflow-y-auto h-[86vh] mt-5 flex-1'>
                    <GantChart size="158vh" width={120}/>
                </div>
            </div>
        </div>

    )
}

export default ProjectSchedule