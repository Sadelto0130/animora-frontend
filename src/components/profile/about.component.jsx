import { getFullDate } from "../../libs/utils.js";
import { Link } from "react-router-dom";

const AboutUser = ({ bio, email, create, social_links, className }) => {

  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-xl leading-7">
        {bio ? bio : "Nada para leer en la bio"}
      </p>
      <p className="text-xl leading-7 mt-3 mb-3">Contacto: {email}</p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Array.isArray(social_links) &&
          social_links.map((link, i) => {
            const icon =
              link.platform_name !== "website"
                ? "fi-brands-" + link.platform_name
                : "fi-rr-globe";
            return (
              <Link
                to={link.url}
                key={link.id || i}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={`fi ${icon} text-2xl hover:text-black`}></i>
              </Link>
            );
          })}
      </div>

      <p className="text-xl leading-7 text-dark-grey">
        Cuenta creada el {getFullDate(create)}
      </p>
    </div>
  );
};

export default AboutUser;
