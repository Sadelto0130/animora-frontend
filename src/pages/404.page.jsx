import { Link } from "react-router-dom"
import pageNotFound from "../imgs/404.png"
import logo from "../imgs/logo.png"

const NotFoundPage = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img src={pageNotFound} alt="Página no encontrada" className="select-none border-2 border-grey w-72 aspect-square"/>
      <h1 className="text-4xl font-gelasio leading-7">Página No Encontrada</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8"> Lo sentimos, la página que buscas no existe. Vuelve a la <Link to="/" className="text-black underline">página de inicio</Link>.</p>

      <div className="mt-auto">
        <img src={logo} alt="Logo" className="h-12 object-contain block mx-auto select-none"/>
        <p className="mt-5 text-dark-grey">Lee miles de artículos en nuestro blog.</p>
      </div>
    </section>
  )
}

export default NotFoundPage