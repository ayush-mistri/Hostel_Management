import PropTypes from "prop-types";

Input.propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      req: PropTypes.bool.isRequired,
      type: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string,
    }).isRequired,
  };


function Input({ field }) {
    const name = (field.name).charAt(0).toUpperCase() + (field.name).slice(1);
    const placeholder = field.placeholder;
    const required = field.req;
    const type = field.type;
    const value = field.value;
    return (
        <div>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-white">{name.toLowerCase()==='cms' ? 'CMS':name}</label>
            <input type={type} name={name} id={name} className=" border sm:text-sm rounded-lg block w-full p-2.5 bg-highlight border-secondary placeholder-black text-white focus:ring-black focus:border-black outline-none" placeholder={placeholder} required={required} value={value} onChange={field.onChange} />
        </div>
    );
}


export { Input };