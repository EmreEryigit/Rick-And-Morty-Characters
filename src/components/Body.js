import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Pagination } from "semantic-ui-react";
import "./Body.css";
const GET_ALL_USERS = gql`
  query getPage($page: Int) {
    characters(page: $page) {
      results {
        image
        name
        gender
        location {
          name
        }
        species
      }
    }
  }
`;
const Body = () => {
  const [filtered, setFiltered] = useState([])
  const [genderFilter, setGenderFilter ] = useState("")
  const [speciesFilter, setSpeciesFilter ] = useState("")
  const [locationFilter, setLocationFilter ] = useState("")
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
 
  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    variables: {
      page: page,
    },
  });
  useEffect(() => {
    if (data) {
      setFiltered(data.characters.results);
    }
  },[data])
  useEffect(() => {
    if(data) {
      if(genderFilter){
        setFiltered(prev => prev.filter(c => c.gender === genderFilter))
      }
    }
  }, [genderFilter,data])
  useEffect(() => {
    if(data) {
      if(speciesFilter){
        setFiltered(prev => prev.filter(c => c.species === speciesFilter))
      }
    }
  }, [speciesFilter,data])
  useEffect(() => {
    if(data) {
      if(locationFilter){
        setFiltered(prev => prev.filter(c => c.location === locationFilter))
      }
    }
  }, [locationFilter,data])
 
  useEffect(() => {
    if(data) {
      if(search){
        setFiltered(prev => prev.filter(c => c.name.toLowerCase().includes(search.toLowerCase())))
      } else {
        setFiltered(data.characters.results)
      }
    }
  }
  , [search])
  if (loading) {
    return <p>Loading...</p>;
  }
  const handleClear = () => {
    setFiltered(data.characters.results);
  }
  
  console.log(filtered)
  //gender Filter
  let gender = [];
  gender = data.characters.results.map((c) => c.gender);
  let uniqueGender = [...new Set(gender)];
  // species Filter
  let species = [];
  species = data.characters.results.map((c) => c.species);
  let uniqueSpecies = [...new Set(species)];

  // location Filter
  let location = [];
  location = data.characters.results.map((c) => c.location.name);
  let uniquelocation = [...new Set(location)];

  // search Filter
  const filteredData =
  data.characters.results.length !== 0 &&
  data.characters.results.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.species.toLowerCase().includes(search.toLowerCase()) ||
      c.location.name.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <div>
      <div className="bigContainer">
        <div className="searchContainer">
          <input
            className="input"
            placeholder="Search for characters, locations, or species..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered &&  <><div className="optionsContainer">
            <label htmlFor="gender">Gender</label>
            <select name="gender" id="gender" onChange={(e) => setGenderFilter(e.target.value) }>
              {uniqueGender.length !== 0
                ? uniqueGender.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))
                : "No gender found"}
            </select>
          </div>
          <div className="optionsContainer">
            <label htmlFor="species">Species</label>
            <select name="species" id="species" onChange={(e) => setSpeciesFilter(e.target.value) } >
              {uniqueSpecies.length !== 0
                ? uniqueSpecies.map((g) => (
                    <option key={g} value={g}> 
                      {g}
                    </option>
                  ))
                : "No species found"}
            </select>
          </div>
          <div className="optionsContainer">
            <label htmlFor="location">Location</label>
            <select
              name="location"
              id="location"
              onChange={(e) => setLocationFilter(e.target.value) } >
              {uniquelocation.length !== 0
                ? uniquelocation.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))
                : "No location found"}
            </select>
          </div></>}
        </div>
      </div>
                  <button className="btn btn-warning" onClick={handleClear}>Clear Filters</button>
      <div className="cardContainer">
        {filtered.length !== 0 ? (
          filtered.map((c) => (
            <div
              key={c.id}
              className="card d-inline-block my-2 mx-2"
              style={{ width: "18rem" }}
            >
              <img src={c.image} className="card-img-top" alt="..." />
              <div className="card-title">
                <b>{c.name}</b>
              </div>
              <div className="card-body">
                <h5 className="card-title">{c.species}</h5>
                <p className="card-text">{c.location.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Hang on a min</p>
        )}
      </div>
      
      <Pagination
        defaultActivePage={page}
        totalPages={42}
        onPageChange={(e, { activePage }) => setPage(activePage)}
      />
    </div>
  );
};

export default Body;
