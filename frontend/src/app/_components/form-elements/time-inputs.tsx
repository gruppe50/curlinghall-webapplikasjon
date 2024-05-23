'use client';
import React, { useEffect, useState } from 'react';

type TimeInputProps = {
  label:      string;
  showLabel?: boolean
  name:       string;
  value:      string;
  updateEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type DateInputProps = {
  label:      string;
  showLabel?: boolean
  name:       string;
  value:      string;
  allowPastDates?: boolean;
  tooLateToday?:   boolean;
  updateEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ label, name, value, showLabel=false, allowPastDates = true, tooLateToday=false, updateEvent }) => {
  
  const today = new Date();
  const tomorrow = new Date(new Date().setDate(today.getDate() + 1));

  const [earliestDate, setEarliestDate] = useState<Date>(today);
  const [isValidDate, setIsValidDate] = useState<boolean>(true);

  useEffect(() => {
    setEarliestDate(!tooLateToday ? today : tomorrow);

    if (!allowPastDates) {
      if (tooLateToday && value === today.toISOString().split('T')[0]) {
        setIsValidDate(false);
      } else if (!tooLateToday && value === today.toISOString().split('T')[0]) {
        setIsValidDate(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooLateToday])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateEvent(event);

    const selectedDate = new Date(event.target.value).setHours(0, 0, 0, 0);

    if (!allowPastDates) {
      if (selectedDate < earliestDate.setHours(0, 0, 0, 0) || isNaN(selectedDate)) {
        setIsValidDate(false);
      } else {
        setIsValidDate(true);
      }
    } else {
      if (isNaN(selectedDate)) {
        setIsValidDate(false);
      } else {
        setIsValidDate(true);
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
        min={!allowPastDates 
          ? (!tooLateToday
            ? today.toISOString().split('T')[0]
            : tomorrow.toISOString().split('T')[0]
        ) : undefined}
        onChange={handleChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isValidDate ? '' : 'text-red-500'}`}
      />
      <span className="sr-only">velg dato</span>
    </fieldset>
  );
};

export const TimeInput: React.FC<TimeInputProps> = ({ label, showLabel=false, name, value, updateEvent }) => {
  const [hours, setHours] = useState<string>('00');
  const [minutes, setMinutes] = useState<string>('00');

  useEffect(() => {
    const [newHours, newMinutes] = value.split(':');
    handleChange2(newHours, 'hours');
    handleChange2(newMinutes, 'minutes');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    let { value } = event.target;

    if (isNaN(parseInt(value, 10))) {
      if (name === 'hours') {
        value = hours;
      } else {
        value = minutes;
      }
    }

    if (value.startsWith('0') && value !== '0') {
      value = value.replace(/^0+/, '');}

    value = value.replace(/\D/g, '').slice(0, 2).padStart(2, '0');

    if (name === 'hours' && (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
      setHours(value);
    } else if (name === 'minutes' && (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
      setMinutes(value);
    }
    updateEvent(event);
  };

  const handleChange2 = (value: string, name: string) => {
    // Ugly, but it works. I den't know how to make handleChange work with both value/name
    // and event/name, and some events don't have values that can be parsed, hence the two
    // versions of this function.
    if (isNaN(parseInt(value, 10))) {
      if (name === 'hours') {
        value = hours;
      } else {
        value = minutes;
      }
    }
  
    if (value.startsWith('0') && value !== '0') {
      value = value.replace(/^0+/, '');
    }
  
    value = value.replace(/\D/g, '').slice(0, 2).padStart(2, '0');
  
    if (name === 'hours' && (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
      // Update hours directly
      setHours(value);
    } else if (name === 'minutes' && (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
      // Update minutes directly
      setMinutes(value);
    }
  };

  const increment = (name: string) => {
    if (name === 'hours') {
      const newHours = (parseInt(hours, 10) + 1) % 24;
      setHours(newHours.toString().padStart(2, '0'));
    } else {
      // if (name === 'minutes')
      const newMinutes = (parseInt(minutes, 10) + 1) % 60;
      setMinutes(newMinutes.toString().padStart(2, '0'));
    }
  };

  const decrement = (name: string) => {
    if (name === 'hours') {
      const newHours = (parseInt(hours, 10) - 1 + 24) % 24;
      setHours(newHours.toString().padStart(2, '0'));
    } else {
      // if (name === 'minutes')
      const newMinutes = (parseInt(minutes, 10) - 1 + 60) % 60;
      setMinutes(newMinutes.toString().padStart(2, '0'));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, name: string) => { 
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      increment(name);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      decrement(name);
    }
  };
  const handleKeyRelease = (event: React.KeyboardEvent<HTMLInputElement>, name: string) => {
    handleChange(event as unknown as React.ChangeEvent<HTMLInputElement>, name);
  }

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleDivFocus = (event: React.MouseEvent<HTMLDivElement>) => {
    const input = event.target as HTMLInputElement;
  if (input.tagName.toLowerCase() !== 'input') {
    const firstInput = event.currentTarget.querySelector('input');
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }}
  };

  return (
    <fieldset>
      {showLabel &&
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
            {label}
          </label>
      }
      <div 
        className="relative shadow appearance-none border rounded w-full py-2 pl-10 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onClick={handleDivFocus}
      >
        <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
          </svg>
        </div>
        <input
          type="text"
          name={`${name}Hours`}
          value={hours}
          onKeyDown={(event) => handleKeyPress(event,'hours')}
          onKeyUp={(event) => handleKeyRelease(event, name)}
          onChange={(event) => handleChange(event, 'hours')}
          onFocus={handleInputFocus}
          autoComplete="off"
          className="text-center mr-2 w-5 focus:outline-none caret-transparent"
        />
        <span>:</span>
        <input
          type="text"
          name={`${name}Minutes`}
          value={minutes}
          onKeyDown={(event) => handleKeyPress(event, 'minutes')}
          onKeyUp={(event) => handleKeyRelease(event, name)}
          onChange={(event) => handleChange(event, 'minutes')}
          onFocus={handleInputFocus}
          autoComplete="off"
          className="text-center ml-2 w-5 focus:outline-none caret-transparent"
        />
      </div>
    </fieldset>
  );
};