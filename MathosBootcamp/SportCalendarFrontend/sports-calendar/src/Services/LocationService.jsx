import api from "../http-common";

const getLocations = () => {
  return api.get("/Location");
};

const createLocation = (location) => {
  return api.post("/Location", location);
};

const updateLocation = (id, location) => {
  return api.put(`/Location/${id}`, location);
};

const deleteLocation = (id) => {
  return api.delete(`/Location/${id}`);
};

const CountyService = {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation
};

export default CountyService;
