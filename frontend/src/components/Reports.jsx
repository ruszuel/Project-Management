import React, { useState, useEffect } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';
import axios from 'axios';
import { Toaster } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [taskData, setTaskData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [toggleDropdown, setToggleDropdown] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    assigned: '',
    priority: '',
    sprint: '',
    startDate: '',
    endDate: '',
  });
  const [membersData, setMembersData] = useState([]);

  const statuses = ['Ongoing', 'Not started', 'Completed', 'Pending'];
  const priorities = ['Low', 'Medium', 'High', 'Very High'];
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/tasks');
        setTaskData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/members');
        setMembersData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
    fetchMembers();
  }, []);

  const handleToggleDropdown = (key) => {
    setToggleDropdown((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyFilters = () => {
    const filtered = taskData.filter((task) => {
      const { status, assigned, priority, sprint, startDate, endDate } = filters;

      const matchesStatus = status ? task.status === status : true;
      const matchesAssigned = assigned ? task.assigned === assigned : true;
      const matchesPriority = priority ? task.priority === priority : true;
      const matchesSprint = sprint ? task.sprint === Number(sprint) : true;
      const matchesStartDate = startDate ? new Date(task.starting_date) >= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(task.deadline) <= new Date(endDate) : true;

      return matchesStatus && matchesAssigned && matchesPriority && matchesSprint && matchesStartDate && matchesEndDate;
    });

    setFilteredData(filtered);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Task Report', 14, 10);
    doc.autoTable({
      head: [['Task', 'Feature', 'Status', 'Assigned', 'Sprint', 'Priority', 'Start Date', 'Deadline']],
      body: filteredData.map((task, index) => [
        index + 1,
        task.feature,
        task.status,
        task.assigned,
        task.sprint,
        task.priority,
        task.starting_date,
        task.deadline,
      ]),
    });
    doc.save('Task_Report.pdf');
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <div className='flex w-full h-screen p-5 font-poppins bg-gray-300 relative'>
        <Toaster richColors position="top-right" duration={3000} toastOptions={{
                className: 'text-base'
            }}/>
            <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-14 h-full gap-10 flex flex-col'>
                <div className="relative flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-2xl">Welcome back!</p>
                        <p className="text-gray-400 text-sm">Here's a list of the tasks for the project!</p>
                    </div>

                    {/* Export Button positioned at the top right */}
                    <div className="absolute right-5 top-0">
                        <button
                        className="export-pdf-btn py-2 px-5 bg-blue-950 text-white rounded-md hover:bg-blue-900 focus:outline-none"
                        onClick={exportToPDF}
                        >
                        Export to PDF
                        </button>
                    </div>
                </div>
                        
                <div className="filters-container flex flex-wrap items-center space-x-0 w-full bg-white">
                    <div className="filter-dropdown relative">
                        <button
                            onClick={() => handleToggleDropdown('status')}
                            className="w-40 py-2 px-3 text-left bg-white rounded-l-md border border-gray-300 hover:bg-gray-300 focus:outline-none relative text-sm"
                        >
                            Status
                            <span className="absolute right-2 bottom-2">
                            {toggleDropdown.status ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                            </span>
                        </button>
                        {toggleDropdown.status && (
                            <ul className="dropdown-menu bg-white shadow-lg mt-1 rounded-md w-40 absolute z-10 top-full left-0">
                            {statuses.map((status) => (
                                <li
                                key={status}
                                onClick={() => handleFilterChange('status', status)}
                                className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                                >
                                {status}
                                </li>
                            ))}
                            </ul>
                        )}
                        </div>

                        <div className="filter-dropdown relative">
                        <button
                            onClick={() => handleToggleDropdown('assigned')}
                            className="w-40 py-2 px-3 text-left bg-white border border-gray-300 hover:bg-gray-300 focus:outline-none relative text-sm"
                        >
                            Assigned
                            <span className="absolute right-2 bottom-2">
                            {toggleDropdown.assigned ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                            </span>
                        </button>
                        {toggleDropdown.assigned && (
                            <ul className="dropdown-menu bg-white shadow-lg mt-1 rounded-md w-40 absolute z-10 top-full left-0">
                            {membersData.map((member) => (
                                <li
                                key={member.id}
                                onClick={() => handleFilterChange('assigned', member.name)}
                                className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                                >
                                {member.name}
                                </li>
                            ))}
                            </ul>
                        )}
                        </div>

                        <div className="filter-dropdown relative">
                        <button
                            onClick={() => handleToggleDropdown('priority')}
                            className="w-40 py-2 px-3 text-left bg-white rounded-r-md border border-gray-300 hover:bg-gray-300 focus:outline-none relative text-sm"
                        >
                            Priority
                            <span className="absolute right-2 bottom-2">
                            {toggleDropdown.priority ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                            </span>
                        </button>
                        {toggleDropdown.priority && (
                            <ul className="dropdown-menu bg-white shadow-lg mt-1 rounded-md w-40 absolute z-10 top-full left-0">
                            {priorities.map((priority) => (
                                <li
                                key={priority}
                                onClick={() => handleFilterChange('priority', priority)}
                                className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                                >
                                {priority}
                                </li>
                            ))}
                            </ul>
                        )}
                        </div>

                    {/* Sprint Filter */}
                    <div className="filter-dropdown">
                        <input
                            type="number"
                            id="sprint"
                            min="1"
                            placeholder="Sprint"
                            className="mt-0 mx-5 block w-32 px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={filters.sprint || ''}
                            onChange={(e) => handleFilterChange('sprint', e.target.value)}
                        />
                    </div>

                    <div className="filter-date flex items-center text-sm">
                        {/* Start Date Input */}
                        <input
                            type="date"
                            id="startDate"
                            placeholder="Start Date"
                            className="block w-38 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        />
                        <span className="mx-2 text-gray-500">to</span>
                        {/* End Date Input */}
                        <input
                            type="date"
                            id="endDate"
                            placeholder="End Date"
                            className="block w-38 px-3 py-2 mr-7 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        />
                    </div>

                    {/* Apply Filters Button */}
                    <button
                        onClick={applyFilters}
                        className="w-48 mt-0 py-2 px-4 bg-blue-950 text-white font-normal rounded-md hover:bg-blue-900 focus:outline-none text-sm"
                    >
                        Apply Filters
                    </button>
                </div>

                <div className="table-container overflow-x-auto mt-2">
                    <table className="min-w-full table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">#</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Task</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Feature</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Assigned</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Sprint</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Start Date</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Deadline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredData.map((task, index) => (
                            <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{task.feature}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{task.status}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{task.assigned}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{task.sprint}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{task.priority}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{task.starting_date}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{task.deadline}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

  );
};

export default Reports;
