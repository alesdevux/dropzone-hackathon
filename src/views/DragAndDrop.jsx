import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import axios from "axios"

const CLIENT_ID = "356586937758-u07g3erlgb3m82vts4nu2j3jfd72g26d.apps.googleusercontent.com";
const API_KEY = "AIzaSyAnf0SWqxzx2BLdGqCjz4bx7yZcrixh7XI";

const DragAndDrop = () => {
  const [user, setUser] = useState({})
  const [files, setFiles] = useState([])
  const [totalSize, setTotalSize] = useState(0)
  
  const isLoggedIn = Object.keys(user).length > 0

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallbackResponse,
    })
    renderLoginButton()
  }, [user])

  useEffect(() => {
    console.log("Files:", files)
  }, [files])

  const handleCallbackResponse = (response) => {
    console.log("Encoded JWT ID token:", response.credential)
    const userDecoded = jwt_decode(response.credential)
    console.log("Decoded JWT ID token:", userDecoded)
    setUser(userDecoded)
  }

  const renderLoginButton = () => {
    google.accounts.id.renderButton(
      document.getElementById("signin"),
      { theme: "dark", width: "wide", height: "standard" }
    )
  }

  const addFile = (file) => {
    console.log("File:", file)
    setFiles([...files, file])
    setTotalSize(totalSize + file.size)
  }

  const removeFile = (index) => {
    let removeFile = files[index]
    let newFiles = files.filter((o, i) => index !== i)
    
    if (newFiles.length > 0) {
      setTotalSize(totalSize - removeFile.size)
      setFiles(newFiles)
    }
    if (newFiles.length <= 0) {
      setTotalSize(0)
      setFiles([])
    }
  }

  const dropFile = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    addFile(file)
  }

  const changeFile = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    addFile(file)
  }

  const sizeToMBorKB = (size) => {
    let mb = (size / 1024 / 1024).toFixed(2)
    if (mb < 1) {
      mb = (size / 1024).toFixed(2)
      return `${mb} KB`
    }
    return `${mb} MB`
  }

  const requestCreateFile = (file) => {
    axios.post(`https://www.googleapis.com/auth/drive.file?key=${API_KEY}`, {
      headers: {
        "Authorization": `Bearer ${user.access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        "name": file.name,
        "mimeType": file.type,
        "parents": [
          
        ]
      }
    }).then(res => {
      console.log("File created:", res.data)
    }).catch(err => {
      console.log("Error creating file:", err)
    })
  }

  return (
    <section className="flex flex-col-reverse justify-between md:flex-row min-h-screen gap-10 p-10 text-white select-none bg-slate-800">
      <div className="flex flex-col flex-1 gap-6 justify-between md:w-3/4">
        {isLoggedIn ? (
          <div className="relative flex items-center border shadow-xl border-emerald-500 flex-1 md:h-3/4 place-content-center shadow-emerald-500/50">
            <input 
              type="file"
              onDrop={(e) => {dropFile(e)}}
              onChange={(e) => {changeFile(e)}}
              className="absolute w-full h-full opacity-0 cursor-pointer"    
            />
            <p className="text-xl md:text-4xl text-center uppercase">Arrastra tus archivos aquí</p>
          </div>
        ) : (
          <button onClick={() => google.accounts.id.prompt()} className="flex-1 md:h-3/4 flex items-center h-full border shadow-xl cursor-pointer border-emerald-500 place-content-center shadow-emerald-500/50 text-xl md:text-4xl text-center uppercase">
            Haz login para poder subir archivos
          </button>
        )}
        
        <button 
          onClick={() => requestCreateFile(files[0])}
          className="p-3 text-sm mb:text-base font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/20 disabled:text-white/50"
          disabled={(!isLoggedIn || files.length <= 0) ? true : false}
        >
          Subir {files.length} archivo{files.length === 0 || files.length > 1 ? "s" : ""} a Google Drive
        </button>
      </div>
      <div className="flex flex-col justify-center md:w-1/4 gap-5 mb:gap-10">
        <div className="pb-5 mb:pb-10 border-b-2 border-b-white/30">
          <h3 className="py-4 text-xl font-semibold text-center">Te damos la bienvenida a DDrop</h3>
          {isLoggedIn ? (
            <>
              <p className="uppercase text-md">Archivos cargados:</p>
              <p className="text-sm opacity-40">{sizeToMBorKB(totalSize)}/{sizeToMBorKB(2000000)}</p>
              <div className="flex flex-col gap-1 text-sm">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <button 
                      onClick={() => {removeFile(index)}}
                      className="content-center justify-center hidden h-5 font-medium rounded-full bg-slate-600/75 hover:bg-slate-500/75 text-white/60 aspect-square group-hover:flex"
                    >
                      x
                    </button>
                    <p>{file.name}</p>
                    <p className="opacity-40">{sizeToMBorKB(file.size)}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="max-w-[75ch]">Para subir tus archivos de forma simple a Drive, puedes hacer Login a través de Google.</p>
          )}
        </div>
        { isLoggedIn ? (
          <>
            <div className="flex items-center gap-5">
              <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-lg font-bold">Hola {user.name}</p>
                <p className="text-md">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => setUser({})} 
              className="p-3 border-2 border-white rounded-md hover:bg-white/10">
              Sign Out
            </button>
          </>
        ) : (
          <div id="signin"></div>
        )}
      </div>
    </section>
  )
}

export default DragAndDrop