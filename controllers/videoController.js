// const Video = require('../schema/Video');
// const Language = require('../schema/Language');

const { Video, Language } = require('../schema/Video');

const uploadLanguage = async (req, res) => {
    let { language } = req.body;

    language = language.trim().toLowerCase();

    if (!language) {
        return res.status(400).json({
            "status": "bad-request-error",
            "message": "Please enter a language to add."
        });
    }

    try {
        const existingLanguage = await Language.findOne({ language: language });

        if (existingLanguage) {
            return res.status(400).json({
                "status": "duplicate-entry",
                "message": "This language is already present in the database."
            });
        }
        const uploadedLanguage = await Language.create({ language });
        return res.status(201).json(uploadedLanguage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
};


const getAllLanguages = async (req, res) => {
    try {
        const languages = await Language.find();
        return res.status(200).json(languages);
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
};

const deleteLanguage = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            "status": "bad-request-error",
            "message": "Language ID is required"
        });
    }

    try {
        const language = await Language.findByIdAndDelete(id);

        if (!language) {
            return res.status(404).json({
                "status": "not-found",
                "message": "Language not found"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Language deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
};


const uploadVideo = async (req, res) => {
    const { language, original_video_url, generated_video_url } = { ...req.body };

    if (!language || !original_video_url || !generated_video_url) {
        return res.status(400).json({
            "status": "bad-request-error",
            "message": "Please provide all the details"
        });
    }

    try {
        const languageExists = await Language.findById(language);
        if (!languageExists) {
            return res.status(404).json({
                "status": "not-found-error",
                "message": "Language not found"
            });
        }
        const uploadedVideo = await Video.create({ language, original_video_url, generated_video_url });
        return res.status(201).json(uploadedVideo);
    } catch (error) {
        console.error("Error uploading video:", error.message);
        return res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
};

const getAllVideos = async (req, res) => {
    try {
      const { language, original_video_url, generated_video_url } = req.query;
      let filter = {}; 
  
      if (language) {
        // filter.language = language; 
        filter['language'] = language;
      }
  
      if (original_video_url) {
        filter.original_video_url = original_video_url;
      }

      if (generated_video_url) {
        filter.generated_video_url = generated_video_url;
      }
  
      const videos = await Video.find(filter); 
    // const videos = await Video.find(filter).populate('language');
      return res.status(200).json(videos); 
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
  

const getVideo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            "status": "bad-request-error",
            "message": "Video ID is required"
        });
    }

    try {
        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                "status": "not-found",
                "message": "Video not found"
            });
        }

        return res.status(200).json(video);
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
};

const deleteVideo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            "status": "bad-request-error",
            "message": "Video ID is required"
        });
    }

    try {
        const video = await Video.findByIdAndDelete(id);

        if (!video) {
            return res.status(404).json({
                "status": "not-found",
                "message": "Video not found"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Video deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
};

module.exports = {
    uploadVideo,
    getVideo,
    deleteVideo,
    getAllVideos,
    uploadLanguage,
    getAllLanguages,
    deleteLanguage
};
