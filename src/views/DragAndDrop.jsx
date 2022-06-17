import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"

const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;

const DragAndDrop = () => {
  const [user, setUser] = useState({})
  const isLoggedIn = Object.keys(user).length > 0

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

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallbackResponse,
    })
    renderLoginButton()
  }, [user])

  return (
    <section className="flex min-h-screen gap-10 p-10 text-white bg-slate-800">
      <div className="flex flex-col justify-between w-3/4">
        {isLoggedIn ? (
          <div className="flex items-center border shadow-xl cursor-pointer border-emerald-500 h-3/4 place-content-center shadow-emerald-500/50">
            <p className="text-4xl uppercase">Arrastra tus archivos aquí</p>
          </div>
        ) : (
          <button onClick={() => google.accounts.id.prompt()} className="h-3/4">
            <div className="flex items-center h-full border shadow-xl cursor-pointer border-emerald-500 place-content-center shadow-emerald-500/50">
              <p className="text-4xl uppercase">
                {isLoggedIn ? "Arrastra tus archivos aquí" : "Haz login para poder subir archivos"}
              </p>
            </div>
          </button>
        )}
        
        <button className="p-3 font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/20" disabled={isLoggedIn ? false : true}>
          Subir archivos
        </button>
      </div>
      <div className="flex flex-col justify-center w-1/4 gap-10">
        <div className="pb-10 border-b-2 border-b-white/30">
          <h3 className="py-4 text-xl font-semibold text-center">Te damos la bienvenida a DDrop</h3>
          <p className="max-w-[75ch]">Para subir tus archivos de forma simple a Drive, puedes hacer Login a través de Google.</p>
        </div>
        {/* <button className="p-3 border-2 border-white rounded-md hover:bg-white/10">
          Login con Google
        </button> */}
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