type TextInputProps = {
  label: string;
  name:  string;
  value: string;
  updateEvent: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type DateInputProps = {
  label:      string;
  showLabel?: boolean
  name:       string;
  value:      string;
  allowPastDates? : boolean;
  updateEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ label, name, value, updateEvent }) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateEvent(event);
  };

  return (
    <fieldset>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
        {label}
      </label>
      <input
        name={name}
        type="text"
        value={value}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder={`Skriv inn ${label.toLowerCase()}...`}
      />
    </fieldset>
  );
};

export const TextArea: React.FC<TextInputProps> = ({ label, name, value, updateEvent }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateEvent(event);
  };

  return (
    <fieldset>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder={`Skriv inn ${label.toLowerCase()}...`}
      />
    </fieldset>
  );
};

type DatePickerProps = {
  label: string
  name: string
  value: Date   
  showLabel?: boolean
  allowPastDates?: boolean
  updateEvent: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const DateInput: React.FC<DateInputProps> = ({ label, name, value, showLabel=false, allowPastDates = true, updateEvent }) => {

  const currentDate = new Date().toISOString().split('T')[0];

  /*
  useEffect(() => {
    let value = currentDate;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateEvent(event);

    if (!allowPastDates) {
      const selectedDate = new Date(event.target.value).setHours(0, 0, 0, 0);
      const currentDate = new Date().setHours(0, 0, 0, 0);

      if (isNaN(selectedDate) || (selectedDate < currentDate)) {
        event.target.classList.add('text-red-500');
      } else {
        event.target.classList.remove('text-red-500');
      }
    }
  };

  return (
    <fieldset>
      {showLabel &&
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
          {label}
        </label>
      }
      <input
        name={name}
        type="date"
        value={value}
        min={allowPastDates ? currentDate : undefined}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <span className="sr-only">velg dato</span>
    </fieldset>
  );
};

