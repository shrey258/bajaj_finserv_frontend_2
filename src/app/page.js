"use client"
import { useEffect, useState } from "react";

export default function Home() {
  const [enteredText, setEnteredText] = useState("");
  const [message, setMessage] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTextSubmit = () => {
    try {
      setMessage(null);
      const parsedJson = JSON.parse(enteredText);
      fetch("https://bajaj-finserv-backend-2.vercel.app/bfhl", {
        method: "POST",
        
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedJson)
      })
        .then(response => response.json())
        .then(data => {
          setResponseData(data);
        })
        .catch(error => {
          console.log("Error:", error);
        });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDisplayChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFilters(value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  // Add this console log to check the response data
  useEffect(() => {
    if (responseData) {
      console.log("Response Data:", responseData);
    }
  }, [responseData]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Text Filter</h1>
      
      <div className="mb-6">
        <input 
          type="text" 
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md mb-2" 
          onChange={e => setEnteredText(e.target.value)} 
          placeholder="Enter your text" 
        />
        <button 
          onClick={handleTextSubmit} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md font-semibold transition duration-300"
        >
          Submit
        </button>
      </div>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {responseData && (
        <div className="mb-6">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-gray-700 text-white p-2 rounded-md text-left flex justify-between items-center"
            >
              {selectedFilters.length > 0 ? selectedFilters.join(', ') : 'Select filters'}
              <span>{isDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 bg-gray-800 w-full mt-1 rounded-md shadow-lg z-10">
                {['numbers', 'alphabets', 'hi_al'].map(filter => (
                  (filter === 'hi_al' ? responseData.highest_lowercase_alphabet : responseData[filter]) && (
                    <div 
                      key={filter}
                      className="p-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleFilterChange(filter)}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.includes(filter)} 
                        readOnly 
                        className="mr-2"
                      />
                      {filter === 'hi_al' ? 'Highest Alphabet' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {responseData && selectedFilters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedFilters.includes('numbers') && responseData.numbers && (
            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Numbers:</h3>
              <ul>
                {responseData.numbers.map((number, index) => (
                  <li key={index}>{number}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedFilters.includes('alphabets') && responseData.alphabets && (
            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Alphabets:</h3>
              <ul>
                {responseData.alphabets.map((alphabet, index) => (
                  <li key={index}>{alphabet}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedFilters.includes('hi_al') && responseData.highest_lowercase_alphabet && (
            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Highest Alphabet:</h3>
              <p>{responseData.highest_lowercase_alphabet}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
