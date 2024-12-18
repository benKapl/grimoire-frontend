import clsx from 'clsx';
// import 'antd/dist/antd.css';
import { Popover } from 'antd';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import AceEditor from "react-ace";

// Import a theme and a language mode from Ace
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github_light_default";
import "ace-builds/src-noconflict/theme-dracula";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";

// import "ace-builds/src-noconflict/worker-javascript";

import LanguageSelector from '../Selectors/LanguageSelector';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

const CodeBloc = ({ 
            blocId,
            noteId,
            type,
            language,
            position,
            lineCount,
            content, 
            deleteBloc,
            addBloc,
        }) => {

    const user = useSelector((state) => state.user.value);

    const [code, setCode] = useState(content);    // Set code content, initialized with bloc content in DB
    const [isRunCodeShown, setIsRunCodeShown] = useState(false)
    const [runResult, setRunResult] = useState("")
    const [lineCounter, setLineCounter] = useState(lineCount);
    const [blocHeight, setBlocHeight] = useState('80px'); // not linked to backend
    const [isBlocHovered, setIsBlocHovered] = useState(false);   

    const [selectedLanguage, setSelectedLanguage] = useState(user.defaultDevLanguage)

    /** Manage bloc size depending on number of lines in ediotr */
    useEffect(() => {
        // increase blocHeight on every 5 lines added
        (lineCounter % 5 === 0) && setBlocHeight(`${(lineCounter + 4)*16}px`) 
    }, [lineCounter])

    useEffect(() => {
        getLanguage(language)
    }, [])
    
    /** Get bloc language and format it */
    const getLanguage = async (language) => { // fetch with bloc language id
        console.log("lnaguag", language)
        const response = await fetch(`${backendUrl}/dev/languages/type/id/value/${language}`)
        const data = await response.json()
        const languageObject = data.language
        data.result && setSelectedLanguage(languageObject)
    }

    /** Load editor and define custom commands */
    const handleEditorLoad = (editor) => {
        // Set Shift+delete to delete a codebloc
        editor.commands.addCommand({
            name: "deleteBloc",
            bindKey: { win: "Shift-Backspace", mac: "Shift-Backspace" }, // Bind to Backspace key
            exec: () => {
                deleteBloc(blocId);
            },
        });
        //count number of line to define bloc height
        const updateLineCount = () => {
            const lines = editor.session.getLength();
            setLineCounter(lines);
          };
      
          // Update line count whenever the editor content changes
          editor.session.on("change", updateLineCount);
      
          // Initialize the line count on editor load
          updateLineCount();
    };

    /** When code it written, it updates the input and save bloc in dv */
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        saveBloc(newCode);
    };

    /** Exec code and display result */
    const runCode = async () => {
        setIsRunCodeShown(true)

        const response = await fetch(`${backendUrl}/dev/code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language: selectedLanguage.apiValue })
          })
          const apiResponse = await response.json()

          if (apiResponse.result) {
            setRunResult(apiResponse.data.output)
            // setRunResult(JSON.stringify(apiResponse.data.output.split("\n")))

            // console.log(JSON.stringify(runResult))
          } else {
            setRunResult("Could not run code ┐( ˘_˘ )┌")
          }
    }

    /** Save bloc in DB */
    const saveBloc = async (newCode) => {
        try {
            const response = await fetch(`${backendUrl}/blocs/save`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blocId, type, content: newCode, language: selectedLanguage._id })
            });
            console.log("selectedLanguage", selectedLanguage)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.result) {
                // for now, only log success
                console.log(`Bloc ${blocId} saved in database`)
                // NEED TO MANAGE NOTE UPDATEDAT HERE (new route put ?)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const popoverContentStyle = "flex w-full focus:outline-none text-darkPurple hover:bg-darkPurple hover:text-white rounded-sm pt-0.5 pb-1 px-2 mt-2 hover:cursor-pointer"
    const popoverContent = (
        <div className="">
          <div className={popoverContentStyle} onClick={() => addBloc(position, "text", noteId)}>Texte</div>
          <div className={popoverContentStyle} onClick={() => addBloc(position, "code", noteId)}>Code</div>
          <div className={popoverContentStyle} onClick={() => addBloc(position, "internal link", noteId)}>Internal link</div>
        </div>
    );
//`h-[${blocHeight}px]`
    const container = "flex flex-1 justify-between items-start mt-1 mb-4"
    const popoverStyle = ""
    const buttonStyle = clsx(
        isBlocHovered ? "bg-lightPurple" : "bg-transparent",
        "rounded-full w-6 h-6 text-center cursor-pointer text-white hover:bg-darkPurple hover:opacity-100 transition-opacity duration-200")

    const codeblocContainer = "flex flex-col justify-between items-center rounded-md bg-lightPurple w-[94%] p-1 px-2"
    const editorContainer = "flex w-full flex-col justify-center items-start mb-2"
    const executionContainer = "flex w-full justify-between items-start "
    const runButton = "bg-darkPurple text-white w-12 h-8 rounded-md hover:bg-grey transition duration-300 ease-in-out mb-1 mr-2"
    const executedCodeContainer = "flex w-[93%] min-h-8 font-mono text-xs justify-start items-start bg-white rounded-md px-2 mb-1"

    return (                            
        <div 
            className={clsx(container)}
            onMouseEnter={() => setIsBlocHovered(true)}
            onMouseLeave={() => setIsBlocHovered(false)}
            >  
            <Popover placement="bottomRight" title="Type de bloc" content={popoverContent} className={popoverStyle} trigger="hover">
                <div 
                    className={buttonStyle}
                    onClick={() => addBloc(position, type, noteId)}>+</div>
            </Popover>
            <div className={codeblocContainer}>
                <div className={editorContainer}>
                <LanguageSelector 
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}/>

                    <AceEditor
                        mode={selectedLanguage.editorValue} // Language mode
                        theme={user.defaultEditorTheme.editorValue} // Theme
                        value={code} // Current code
                        onChange={handleCodeChange} // Update state on code change
                        onLoad={handleEditorLoad}
                        name={`code-editor-${blocId}`} // Unique ID for the editor
                        editorProps={{ $blockScrolling: true }}
                        fontSize={14}
                        width="100%"
                        className="rounded-md"
                        height={blocHeight}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />
                </div>
                {selectedLanguage.isExecutable && <div className={executionContainer}>
                    <button className={runButton} onClick={runCode}>RUN</button>
                    {isRunCodeShown && <div className={executedCodeContainer}>{runResult}</div>} {/* Div that rendered the result of code execution */}
                </div>}
            </div>
        </div>
    )
}

export default CodeBloc