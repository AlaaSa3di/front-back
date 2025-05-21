const Screen = require('../Models/screenModel');

exports.searchScreens = async (req, res) => {
  try {
    const { q } = req.query;
    
    const results = await Screen.aggregate([
      {
        $lookup: {
          from: "spaces",
          localField: "space",
          foreignField: "_id",
          as: "spaceDetails"
        }
      },
      { $unwind: "$spaceDetails" },
      { 
        $match: { 
          "spaceDetails.location.city": new RegExp(q, "i"), 
          "spaceDetails.isDeleted": false 
        } 
      },
      {
        $project: {
          _id: 1,
          title: "$spaceDetails.title",
          location: "$spaceDetails.location.city",
          price: "$dailyPrice",
          image: "$screenImage.url",
          path: { $concat: ["/screens/", { $toString: "$_id" }] }
        }
      }
    ]);

    res.json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};