const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://migtig:H4K0vK6KNtawv2ZF@cluster0.zehslhc.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const VisitCountSchema = new mongoose.Schema({
    page_num: {
        type: Number,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0,
    },
});

const VisitCount = mongoose.model('VisitCount', VisitCountSchema);

// Function to update visit count in MongoDB
async function updateVisitCount(pageNum) {
    try {
        const result = await VisitCount.findOneAndUpdate(
            { page_num: pageNum },
            { $inc: { count: 1 } },
            { upsert: true }
        );
        return result;
    } catch (error) {
        console.error('Error updating visit count:', error);
    }
}

// Function to get visit count in MongoDB
async function getVisitCount(pageNum) {
    try {
        const result = await VisitCount.findOne(
            { page_num: pageNum },
        );
        return result;
    } catch (error) {
        console.error('Error getting visit count:', error);
    }
}

module.exports = { connectDB, VisitCount, updateVisitCount, getVisitCount };