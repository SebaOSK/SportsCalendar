import api from "../http-common";

const getReviews = () => {
  return api.get("/Review");
};

const getReview = (id) => {
  return api.get(`/Review/${id}`);
};

const createReview = (review) => {
  return api.post("/Review", review);
};

const updateReview = (id, review) => {
  return api.put(`/Review/${id}`, review);
};

const removeReview = (id) => {
  return api.delete(`/Review/${id}`);
};

const ReviewService = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  removeReview
};

export default ReviewService;
