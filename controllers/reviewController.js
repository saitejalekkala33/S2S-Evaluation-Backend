const { Review } = require('../schema/Video');

const uploadReview = async (req, res) => {
  try {
    const { username, videoId, ratings, comment } = req.body;

    if (!ratings || !ratings.lipSync || !ratings.translation || !ratings.audio || !ratings.overall) {
      return res.status(400).json({ status: 'error', message: 'All rating fields are required.' });
    }

    if (!username || !videoId || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newReview = new Review({
      username,
      videoId,
      ratings,
      comment,
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
    const { videoId } = req.query;
    const reviews = await Review.find({videoId: videoId});
    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      username: review.username,
      videoId: review.videoId,
      ratings: review.ratings,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      __v: review.__v,
    }));
    return res.status(200).json(formattedReviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    return res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};


module.exports = {
  uploadReview,
  getReview,
  getAllReviews,
  deleteReview,
};
