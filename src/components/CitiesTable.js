import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Define fetchCities inside useEffect
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=50&start=${page * 50}`
        );
        setCities((prevCities) => [...prevCities, ...response.data.records]);
        if (response.data.records.length === 0) setHasMore(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [page]); // Only run this effect when 'page' changes

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = cities.filter((city) =>
      city.fields.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleSort = (column) => {
    const sortedCities = [...cities].sort((a, b) =>
      a.fields[column].localeCompare(b.fields[column])
    );
    setCities(sortedCities);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search cities..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <InfiniteScroll
        dataLength={cities.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>City Name</th>
              <th onClick={() => handleSort('country')}>Country</th>
              <th onClick={() => handleSort('timezone')}>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {(searchQuery ? filteredCities : cities).map((city) => (
              <tr key={city.recordid}>
                <td>
                  <Link to={`/weather/${city.fields.name}`}>
                    {city.fields.name}
                  </Link>
                </td>
                <td>{city.fields.country}</td>
                <td>{city.fields.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default CitiesTable;
