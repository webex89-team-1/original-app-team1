import "./FormItem.css";

export function FormItem({ label, type, name, value, onChange }) {
  return (
    <div className="form-item">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
