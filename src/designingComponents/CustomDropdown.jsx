// designingComponents/CustomDropdown.jsx
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";

const CustomDropdown = ({ label, value, onChange, options, placeholder }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-slate-300 mb-1">{label}</label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-slate-600 bg-slate-900 py-2 pl-3 pr-10 text-left text-slate-200 focus:outline-none focus:border-teal-500 sm:text-sm">
            <span className="block truncate">
              {value || placeholder || "Select"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-600 bg-slate-800 py-1 text-base shadow-lg focus:outline-none sm:text-sm"
            >
              {options.map((opt, idx) => (
                <Listbox.Option
                  key={idx}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-slate-200"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {opt || "All"}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomDropdown;
