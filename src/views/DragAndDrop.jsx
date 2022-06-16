import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"

const DragAndDrop = () => {
  const [user, setUser] = useState({})
  const clientId = "356586937758-u07g3erlgb3m82vts4nu2j3jfd72g26d.apps.googleusercontent.com"

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
      client_id: clientId,
      callback: handleCallbackResponse,
    })
    renderLoginButton()
    // google.accounts.id.prompt()
  }, [user])

  return (
    <section className="flex min-h-screen gap-10 p-10 text-white bg-slate-800">
      <div className="flex flex-col justify-between w-3/4">
        <div className="flex items-center border shadow-xl border-emerald-500 h-3/4 place-content-center shadow-emerald-500/50 cursor-grabbing">
          <p className="text-4xl uppercase">Arrastra tus archivos aquí</p>
        </div>
        
        <button className="p-3 font-bold bg-emerald-600 hover:bg-emerald-500">
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
        { Object.keys(user).length > 0 ? (
          <>
            <div className="flex gap-5 items-center">
              <img src={user.picture} alt={user.name} className="rounded-full h-12 w-12" />
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