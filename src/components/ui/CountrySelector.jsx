import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  GetCountries,
  GetState,
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useBlog } from "../../context/BlogContext";

export default function LocationSelector({countryPost, statePost, cityPost}) {
  const { posts, posts:  {country, state, city},setPosts } = useBlog();

  useEffect(() => {
    setPosts({
      ...posts, 
      country: countryPost,
      state: statePost,
      city: cityPost
    })
  }, [])

  const [countryState, setCountryState] = useState(
    posts?.country
      ? { 
        id: country.countryId || countryPost?.id, 
        name: country.country || countryPost?.name, 
        isoCode: country.countryCode || countryPost.iso3
      }
      : null
  );

  const [stateState, setStateState] = useState(
    posts.state
      ? { id: state.stateId, name: state.state, isoCode: state.stateCode }
      : null
  );

  const [cityState, setCityState] = useState(
    posts.city ? { id: city.cityId, name: city.city } : null
  );

  const handleCountryChange = (country) => {
    setCountryState(country);
    setPosts((prev) => ({
      ...prev,
      country: country,
    }));
  };

  const handleStateChange = (state) => {
    setStateState(state);
    setPosts((prev) => ({
      ...prev,
      state: state,
    }));
  };

  const handleCityChange = (city) => {
    setCityState(city);
    setPosts((prev) => ({
      ...prev,
      city: city,
    }));
  };

  return (
    <div className="w-full mt-6">
      <h4 className="font-semibold mb-2 text-2xl text-dark-grey">
        Ubicación de la Publicación
      </h4>
      <div className="w-full mb-4 text-dark-grey">
        <h6 className="text-gray-700 font-semibold mb-2">País</h6>
        <CountrySelect
          containerClassName="form-group"
          inputClassName=""
          onChange={handleCountryChange}
          defaultValue={country}
          placeHolder="Selecciona el el Pais"
          showFlag={true}
        />

        <h6 className="font-semibold mb-2">Estado</h6>
        <StateSelect
          countryid={country?.id}
          containerClassName="form-group"
          onChange={handleStateChange}
          defaultValue={state}
          placeHolder="Selecciona la Ciudad"
        />

        <h6 className="font-semibold mb-2">Ciudad</h6>
        <CitySelect
          countryid={country?.id}
          stateid={state?.id}
          onChange={handleCityChange}
          defaultValue={city}
          placeHolder="Selecciona Barrio"
        />
      </div>
    </div>
  );
}
