import "./Input.css";

function Input({ type, name, placeholder, value, onChange }) {
    return (
        <input
            className="main__input"
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

export default Input;
