const User = require('../Models/userModel');
const Screen = require('../Models/screenModel');
const Space = require('../Models/spaceModel');
const ContactMessage = require('../Models/ContactModel');
const Booking = require('../Models/bookingModel');

exports.getDashboardStats = async (req, res) => {
  try {
    const usersStats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          admins: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          },
          regularUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] }
          }
        }
      }
    ]);

    const screensStats = await Screen.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const spacesStats = await Space.aggregate([
      {
        $group: {
          _id: '$isApproved',
          count: { $sum: 1 }
        }
      }
    ]);

    const spaceTypesStats = await Space.aggregate([
      {
        $group: {
          _id: '$spaceType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const messagesStats = await ContactMessage.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const paymentsStats = await Booking.aggregate([
      {
        $match: { paymentStatus: 'paid' }
      },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedScreens = screensStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const formattedSpaces = spacesStats.reduce((acc, curr) => {
      acc[curr._id ? 'approved' : 'pending'] = curr.count;
      return acc;
    }, {});

    const formattedMessages = messagesStats.reduce((acc, curr) => {
      acc[curr.status] = curr.count;
      return acc;
    }, {});

    const totalSpacesByType = spaceTypesStats.reduce((sum, type) => sum + type.count, 0);
    const formattedSpaceTypes = spaceTypesStats.map(type => ({
      ...type,
      percentage: totalSpacesByType > 0 ? Math.round((type.count / totalSpacesByType) * 100) : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: usersStats[0]?.total || 0,
          admins: usersStats[0]?.admins || 0,
          regularUsers: usersStats[0]?.regularUsers || 0
        },
        screens: formattedScreens,
        spaces: formattedSpaces,
        spaceTypes: formattedSpaceTypes,
        messages: formattedMessages,
        payments: {
          total: paymentsStats[0]?.totalPayments || 0,
          count: paymentsStats[0]?.count || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};