// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import { RiBubbleChartLine } from 'react-icons/ri';
import { PiNotebookBold } from 'react-icons/pi';
import { FaBars, FaGithub } from 'react-icons/fa';
import hack from '../assets/Hacking.png';

const Sidebar = () => {
  return (
    <div className="bg-gradient-to-b from-slate-600 to-indigo-300 p-4 min-h-screen flex flex-col font-playfair-500">
      <RiBubbleChartLine className='w-12 h-12 text-blue-50 mb-4 ml-8' />
      
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link to="https://colab.research.google.com/drive/1XY_yjoKMoDtamN5WGZfpANiQqtdDZ-TY?usp=sharing" className="flex items-center text-blue-500">
              <PiNotebookBold className="mr-2 w-8 h-8 text-blue-50 my-2 ml-2" />
              <p className='font-bold text-blue-50'>Notebook</p>
            </Link>
          </li>
          <li className="mb-2">
            <Link to="https://github.com/Rediet-Ferew/NLP-UI/" className="flex items-center text-green-500">
              <FaGithub className="mr-2 w-8 h-8 text-blue-50 my-2 ml-2" />
              <p className='font-bold text-blue-50'>GUI</p>
            </Link>
          </li>
          <li className="mb-2">
            <Link to="https://github.com/TigistW/PandoraGuard/tree/samuel.fast-api" className="flex items-center text-green-500">
              <FaGithub className="mr-2 w-8 h-8 text-blue-50 my-2 ml-2" />
              <p className='font-bold text-blue-50'>API</p>
            </Link>
          </li>
          <li>
            <Link to="https://drive.google.com/file/d/1ZEgtQmqrRBE3dcCrFpS6EBamuHVoNz81/view?usp=sharing" className="flex items-center text-yellow-500">
              <FaBars className="mr-2 w-8 h-8 text-blue-50 my-2 ml-2" />
              <p className='font-bold text-blue-50'>Dataset</p>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="w-10 h-10 ml-8">
        <img src={hack} alt="Small hack computer image" />
      </div>
    </div>
  );
};

export default Sidebar;
