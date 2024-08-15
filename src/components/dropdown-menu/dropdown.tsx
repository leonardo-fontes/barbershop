import React, { useEffect, useRef, useState } from "react";

interface Props {
  triggerLabel: string;
  options: {
    label: string;
    onClick: () => void;
  }[];
  className?: string;
  openUpwards?: boolean;
}

export default function DropdownMenu({
  triggerLabel,
  options,
  className,
  openUpwards,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline text-left" ref={dropdownRef}>
      <button
        id="dropdown-button"
        onClick={toggleDropdown}
        className={`${className} inline-flex justify-center w-20  px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500`}
      >
        {triggerLabel}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen ? (
        <div
          id="dropdown-menu"
          className={`${
            openUpwards ? "bottom-full mb-2" : "top-full mt-2"
          } absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50`}
        >
          <div
            className="py-2 p-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-button"
          >
            {options.map((option) => (
              <button
                key={Math.random()}
                className="flex w-full rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer"
                role="menuitem"
                onClick={() => handleOptionClick(option.onClick)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
