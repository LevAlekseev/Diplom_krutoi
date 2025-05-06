import "./Input.css"

function Input({ type, placeholder }) {
    return <input className="main__input" type={type} placeholder={placeholder} />;
}
export default Input;