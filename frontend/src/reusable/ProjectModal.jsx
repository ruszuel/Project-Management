import React from 'react';
import * as Icons from '@remixicon/react';

const ProjectModal = ({ item, onClick }) => {
  const Icon = Icons['RiCommandLine'] || Icons['RiQuestionLine'];

  return (
    <div
      className="flex items-center gap-x-3 px-2 py-2 hover:bg-[rgb(170,183,183)]/75 cursor-pointer rounded-sm"
      onClick={onClick}
    >
      <div className="border border-gray-400 p-1 rounded-md">
        <Icon size={18} color="#1a2d42" />
      </div>
      <p className="text-sm">{item}</p>
    </div>
  );
};

export default ProjectModal;
