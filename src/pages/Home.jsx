import React, { useEffect, useState } from 'react';
import axios from "axios";
import Spinner from "../components/Spinner";
import { IoSearch } from "react-icons/io5";
import MovesTable from "../components/home/MovesTable";
import MovesCard from "../components/home/MovesCard";
import { LuLogOut } from "react-icons/lu";
import CreateModal from '../components/home/CreateModal';
import { FaTableList } from "react-icons/fa6";
import { FaTableCells } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";
import classNames from "classnames";
import { PropagateLoader } from 'react-spinners';



const Home = () => {
  const [open, setOpen] = useState(false);
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('card');
  const [search, setSearch] = useState('');

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    setLoading(true);

    axios
    .get(`${import.meta.env.VITE_API_URL}/moves/search?q=${search}`, {
      withCredentials: true,
    })
    .then((response) => {
      setMoves(response.data.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoading(true);

    axios.interceptors.request.use(request => {
      console.log('Request Cookies:', document.cookie);
      return request;
    });

    //use axios to fetch data from the server, then update the loading state
    axios
      .get(`${import.meta.env.VITE_API_URL}/moves`, { withCredentials: true })
      .then((response) => {
        setMoves(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

  }, []);

  return (
    <div className='bg-[#3B3B3B] h-full min-h-screen h-[calc(100vh)] font-mono text-white'>
      <div className='p-4'>
        <div className='flex justify-center items-center gap-x-4'>
          <div className='flex gap-x-4 p-1 hover:bg-gray-600 rounded-md'>
            <button
              className={classNames('text-2xl bg-[#2E2E33] hover:bg-white hover:text-[#2E2E33] px-3 py-3 rounded-md hover:scale-110 transform transition duration-1', {
                'bg-white text-[#2E2E33]': showType === 'card',
                'bg-[#2E2E33]': showType !== 'card',
              })}
              onClick={() => setShowType('card')}
            >
              <IoGrid />
              {/* Card */}
            </button>
            <button
              className={classNames('text-2xl bg-[#2E2E33] hover:bg-white hover:text-[#2E2E33] px-3 py-3 rounded-md hover:scale-110 transform transition duration-1', {
                'bg-white text-[#2E2E33]': showType === 'table',
                'bg-[#2E2E33]': showType !== 'table',
              })}
              onClick={() => setShowType('table')}
            >
              <FaList />
              {/* Table */}
            </button>            
          </div>


          <button
            className='bg-[#2E2E33] hover:bg-white hover:text-[#2E2E33] px-5 py-2 mx-5 my-5 rounded-md absolute top-1 right-2 flex cursor-pointer hover:scale-110 transform transition duration-1'
            onClick={() => 
              fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', 
              })
                .then(response => {
                  if (response.ok) {
                    window.location.href = '/login';
                  }
                })
            }
          >
            Logout
            <LuLogOut className='ml-2 my-1'/>
          </button>

        </div>
        <div className='mt-4 mb-2 flex items-center bg-white rounded-xl text-[#3B3B3B]'>
          <h1 className='pl-4 ml-3 mr-10 text-4xl py-4 '>My Repertoire</h1>
          <input
            type='text'
            value={search}
            className='bg-gray-300 focus:bg-white p-3 rounded-xl my-3 w-3/5 ml-10 mr-3 focus:outline-none focus:ring focus:ring-blue-300' 
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter")
                handleSearch();
              }}           
            >
          </input>
          <IoSearch onClick={handleSearch} className='text-4xl mr-10 cursor-pointer hover:scale-110 transform transition duration-1'/>    

          <IoIosAddCircle onClick={() => setOpen(true)} className='ml-10 mr-3 text-5xl hover:text-green-400 cursor-pointer hover:scale-110 transform transition duration-1'/>
        </div>
        {loading ? (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
        > 
          <PropagateLoader color="#ffffff"/>
        </div>
        ) : showType === 'card' ? (
          <MovesCard moves={moves} /> 
        ) : ( 
          <MovesTable moves={moves} /> 
        )}
      </div> 
      {open && (
        <CreateModal 
          onClose={handleCloseModal} 
        />
      )}    
    </div>

  )
}

export default Home;