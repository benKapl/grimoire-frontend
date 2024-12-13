import { useState, useEffect } from 'react';
import NoteLink from './NoteLink.js';
// REDUCER
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/user';

import { useRouter } from 'next/router';

//ICONES FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faMoon,
  faBookmark,
  faFolderPlus,
  faFileCirclePlus,
  faFilter,
  faHatWizard,
} from '@fortawesome/free-solid-svg-icons';

import { TbLayoutSidebarLeftCollapseFilled } from 'react-icons/tb';

// Import du composant FooterSideBar
import ConnectedUser from './ConnectedUser.js';

export default function SidebarLeft({ toggleSidebarLeft, createNote }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [selectFavoris, setFavoris] = useState('');
  const [notes, setNotes] = useState([]);

  const router = useRouter();

  // REDUCER
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const currentNote = useSelector((state) => state.currentNote.value);

  const favoris = ['Note 1', 'Note 2'];

  // TODO DYNAMISER LES FAVORIS
  // FETCH NOTE TITLE WITH USER TOKEN
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(backendUrl + `/notes/user/${user.token}`);

        const data = await response.json();
        console.log(data);

        if (data.result) {
          setNotes(data.notes);
        } else {
          console.error('Erreur lors de la récupération des notes', data.error);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des notes', err.message);
      }
    };
    fetchNotes();
  }, [currentNote]);


  return (
    <div className='h-full w-64 bg-backgroundColor flex flex-col'>
      {/* HEADER SIDEBAR */}
      <div className='flex justify-end'>
        <button className='pt-4 text-darkPurple hover:text-lightPurple transition duration-300 ease-in-out'>
          <TbLayoutSidebarLeftCollapseFilled
            size={24}
            onClick={toggleSidebarLeft}
          />
        </button>
      </div>
      <div className='flex justify-center'>
        <img src='logofinal.png' alt='logo' className='w-20 h-20 m-4'></img>
      </div>

      {/* FAVORIS */}
      <div className='border-b-2 border-solid border-gray pl-4 pb-4'>
        <div className='flex items-center justify-normal ml-10'>
          <FontAwesomeIcon icon={faBookmark} className='text-darkPurple' />
          <p className='items-center text-darkPurple m-2 font-bold'>Favoris</p>
        </div>
        <div className='ml-16'>
          {favoris.map((favoris, index) => (
            <p
              key={index}
              onClick={() => setFavoris(favoris)}
              className='text-grey mb-0 cursor-pointer hover:underline'
            >
              {favoris}
            </p>
          ))}
        </div>
      </div>

      {/* ICONES ADD AND FILTER */}
      <div className='flex justify-around'>
        <button>
          <FontAwesomeIcon
            icon={faFolderPlus}
            className='p-4 text-darkPurple text-base hover:text-lightPurple transition duration-300 ease-in-out'
          />
        </button>
        <button>
          <FontAwesomeIcon
            icon={faFileCirclePlus}
            className='p-4 text-darkPurple text-base hover:text-lightPurple transition duration-300 ease-in-out'
            onClick={() => createNote()}
          />
        </button>
        <button>
          <FontAwesomeIcon
            icon={faFilter}
            className='p-4 text-darkPurple text-base hover:text-lightPurple transition duration-300 ease-in-out'
          />
        </button>
      </div>

      {/* NOTES TITLE */}
      <div className='flex-1 overflow-y-auto'>
        {notes.map((note, i) => (
          <NoteLink key={i} title={note.title} noteId={note.id} />
        ))}
      </div>

      {/* Utilisation du comaposant ConnectedUser*/}
        <ConnectedUser />
      
    </div>
  );
}
