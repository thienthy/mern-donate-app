const dotenv = require('dotenv');
const projects = require('./data/project');
const users = require('./data/user');
const User = require('./models/userModel');
const Project = require('./models/projectModel');
const Donation = require('./models/donationModel');
const connectDB = require('./connectDB/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Donation.deleteMany();
    await Project.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProjects = projects.map((project) => {
      return { ...project, userId: adminUser };
    });

    await Project.insertMany(sampleProjects);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Donation.deleteMany();
    await Project.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
