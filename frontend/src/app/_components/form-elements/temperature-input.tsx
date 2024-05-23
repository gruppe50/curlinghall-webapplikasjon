type TemperatureInputProps = {
  label:      string;
  showLabel?: boolean
  name:       string;
  value:      number;
  minValue?:  number;
  maxValue?:  number;
  updateEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TemperatureInput: React.FC<TemperatureInputProps> = ({ label, showLabel, name, value, minValue, maxValue, updateEvent }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateEvent(event);
  };

  return (
    <fieldset>
      {showLabel &&
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
          {label}
        </label>
      }
      <div className="relative flex shadow appearance-none border rounded leading-tight focus:shadow-outline">
        <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-4 pointer-events-none">
        <svg className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M4.699,2.278C2.107,2.278,0,4.386,0,6.977c0,2.593,2.107,4.698,4.699,4.698s4.7-2.106,4.699-4.698 C9.398,4.386,7.291,2.278,4.699,2.278z M4.699,9.327c-1.295,0-2.35-1.054-2.35-2.35c0-1.294,1.055-2.35,2.35-2.35 s2.35,1.055,2.35,2.35C7.049,8.273,5.994,9.327,4.699,9.327z M21.324,19.971c-3.91,0-6.227-2.463-6.227-6.369 c0-4.342,2.721-6.456,6.195-6.456c1.592,0,2.836,0.349,3.703,0.725l0.928-3.475c-0.782-0.435-2.52-0.869-4.807-0.869 c-5.904,0-10.652,3.678-10.652,10.336c0,5.558,3.475,9.783,10.221,9.783c2.346,0,4.198-0.464,4.979-0.841l-0.637-3.473 C24.131,19.709,22.683,19.971,21.324,19.971z"
          />
        </svg>
        </div>
        <input
          name={name}
          type="number"
          value={value}
          min={minValue}
          max={maxValue}
          onChange={handleChange}
          step={0.1}
          autoComplete="off"
          className="rounded-r w-full py-2 px-3 ps-12 text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>
    </fieldset>
  );
};

export default TemperatureInput;