import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { replaceCurrentNote } from '../reducers/currentNote';

import SidebarLeft from "./SidebarLeft"
import SidebarRight from "./SidebarRight"
import Searchbar from "./Searchbar"
import Note from "./Note"
import Placeholder from "./Placeholder"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Home() {
    const [isSidebarLeftVisible, setIsSidebarLeftVisible] = useState(true)
    const [isSidebarRightVisible, setIsSidebarRightVisible] = useState(true)
    const [isNoteVisible, setIsNoteVisible] = useState(true)

    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch()

    const toggleSidebarLeft = () => {
        setIsSidebarLeftVisible(!isSidebarLeftVisible)
    }

    const createNote = async() => {
        const token = user.token
        const response = await fetch(`${backendUrl}/notes/`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await response.json()
        data.result && dispatch(replaceCurrentNote(data.note._id))
      }
    
    return (
        <div className="text-white p-4 flex flex-row space-x h-screen p-0 m-0">
            {isSidebarLeftVisible && <SidebarLeft toggleSidebarLeft={toggleSidebarLeft} createNote={createNote}/> }
            <div className="h-full flex-1 flex flex-col">
                <Searchbar createNote={createNote}/>
                {isNoteVisible ? <Note /> : <Placeholder />}
            </div>
            {isSidebarRightVisible && <SidebarRight /> }
        </div>
    )

}

/*
    <div className="bg-red-500 flex flex-row">
            <div className="basis-1/5 bg-red-500"></div>
            <div className="basis-11/20 bg-blue-500"></div>
            <div className="basis-1/4 bg-blue-500"></div>
    </div>
*/