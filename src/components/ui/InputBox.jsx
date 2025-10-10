import { useState } from "react";
import { CiUser } from "react-icons/ci";

const InputBox = ({name, type, id, value, placeholder, icon, register, rules, error, disabled = false}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input 
        name={name}
        id={id}
        disabled={disabled}
        placeholder={ error ? error.message : placeholder}
        defaultValue={value}
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