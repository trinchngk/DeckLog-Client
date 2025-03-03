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
import { LuConstruction } from "react-icons/lu";




const Home = () => {
  const [open, setOpen] = useState(false);
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('card');
  const [search, setSearch] = useState('');
  const [searchDisplay, setSearchDisplay] = useState(false);

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSearchDisplay = () => {
    setSearchDisplay(false);
    setSearch('');
    fetchMoves();
  }

  const handleSearch = () => {
    setLoading(true);
    setSearchDisplay(true);

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

  const fetchMoves = async () => {
    //use axios to fetch data from the server, then update the loading state
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/moves`, { withCredentials: true })
      .then((response) => {
        setMoves(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);        
        window.location.href = '/login';
      });
  };

  useEffect(() => {
    fetchMoves();
  }, [open]);

  return (
    <div className='bg-[#201c1c] h-full min-h-screen h-[calc(100vh)] font-sans text-white'>
      <div className='p-4'>
        <div className='flex justify-center items-center gap-x-4'>
          <h1 className='text-2xl text-blue-500 font-mono font-semibold absolute top-1 left-2 mx-7 my-7'>
            MoveMonkey
          </h1>

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
            className='bg-blue-500 hover:bg-white hover:text-blue-500 px-5 py-2 mx-5 my-5 rounded-md absolute top-1 right-2 flex cursor-pointer hover:scale-110 transform transition duration-1'
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
        <div className='mt-4 mb-2 flex items-center bg-white rounded-xl text-[#201c1c]'>
          {searchDisplay ? (
            <button 
              className='py-1 px-3 bg-blue-500 text-white hover:text-blue-500 hover:bg-white rounded-md mx-6 my-2 text-lg'
              onClick={handleSearchDisplay}
            >Show All</button>
          ) : (
            <h1 className='mx-6 my-2 text-xl'>My Repertoire</h1>
          )}
          <input
            type='text'
            value={search}
            className='bg-gray-300 focus:bg-white p-3 rounded-xl my-3 w-3/4 ml-10 mr-3 focus:outline-none focus:ring focus:ring-blue-300' 
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter")
                handleSearch();
              }}           
            >
          </input>
          <IoSearch onClick={handleSearch} className='text-4xl mr-10 cursor-pointer hover:scale-110 transform transition duration-1'/>    

          <IoIosAddCircle onClick={() => setOpen(true)} className='ml-10 mr-3 text-5xl hover:text-blue-500 cursor-pointer hover:scale-110 transform transition duration-1'/>
        </div>
          
        {loading ? (
          <div
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
          > 
            <PropagateLoader color="#3c82f6"/>
          </div>
        ) : (
          <>
            { moves[0] ? (
              <>
                {showType === 'card' ? (
                  <MovesCard moves={moves} onSave={fetchMoves}/> 
                ) : ( 
                  <MovesTable moves={moves}/>
                )}
              </>
            ) : (
              <div className='flex justify-center items-center text-white flex-col gap-4 mt-20'>
                <LuConstruction className='text-9xl mt-20'/>
                <h1>No moves yet 😡</h1>                
              </div>
            )}          
          </>
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