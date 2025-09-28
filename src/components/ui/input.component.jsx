import { useState } from "react";
import { CiUser } from "react-icons/ci";

const InputBox = ({name, type, id, value, placeholder, icon, register, rules, error}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input 
        id={id}
        placeholder={ error ? error.message : placeholder}
        type={type == "password" ? passwordVisible ? "text" : "password" : type}
        className={`input-box ${error ? "border-red placeholder-red" : ""}`}
        {...(register ? register(name, rules) : {})}
      />
      <i className={"fi " + icon + " input-icon"}></i>

      {
        type == "password" ?
        <i 
          className={"fi fi-rr-eye" + (!passwordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"}
          onClick={() => setPasswordVisible(currentVal => !currentVal)}
        ></i>
        : ""
      }

    </div>
  )
}

export default InputBox