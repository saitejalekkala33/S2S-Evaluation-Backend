const { Review } = require('../schema/Video');

const uploadReview = async (req, res) => {
  try {
    const { username, videoId, review } = req.body;

    if (!username || !videoId || !review) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newReview = new Review({
      username,
      videoId,
      review,
    });

    await newReview.save();
    return res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (error) {
    console.error('Error uploading review:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate('language');

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

module.exports = {
  uploadReview,
  getReview,
  getAllReviews,
};
