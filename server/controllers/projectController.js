const Project = require('../models/projectModel');
const asyncHandler = require('express-async-handler');
const moment = require('moment');

// @desc fetch all the projects
// @route GET /api/projects
exports.getProjects = asyncHandler(async (req, res) => {
  const pageSize = 6; // the total number of entries on a single page
  const page = Number(req.query.pageNumber) || 1; // the current page number being fetched

  // total number of projects which match with the given key
  const count = await Project.countDocuments({});

  // find all projects that need to be sent for the current page, by skipping the documents included in the previous pages
  // and limiting the number of documents included in this request
  const projects = await Project.find({})
    .populate('donationsId', 'money')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  // loop all projects to change "status" depending on project remain time
  projects.map((project) => {
    const currentDate = new Date();
    const endDate = moment(project.endTime);
    // caculate remain date
    const remainDate = endDate.diff(currentDate, 'days');

    project.remainTime = remainDate;

    if (remainDate > 0 && project.status !== 'Complete') {
      project.status = 'Donate';
    }
    if (remainDate <= 0 && project.status === 'Donate') {
      project.status = 'Finish';
    }
    project.save();
  });

  res.status(200).json({ projects, page, pages: Math.ceil(count / pageSize) });
});

// @desc fetch all the projects by admin
// @route GET /api/admin/projects
exports.getAdminProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({})
    .populate('donationsId', 'money')
    .sort({ createdAt: -1 });

  // loop all projects to change "status" depending on project remain time
  projects.map((project) => {
    const currentDate = new Date();
    const endDate = moment(project.endTime);
    const remainDate = endDate.diff(currentDate, 'days');

    project.remainTime = remainDate;

    if (remainDate > 0 && project.status !== 'Complete') {
      project.status = 'Donate';
    }
    if (remainDate <= 0 && project.status === 'Donate') {
      project.status = 'Finish';
    }
    project.isNew = true;
  });

  res.status(200).json({ projects });
});

// @desc add new project
// @route POST /api/projects
exports.addProject = asyncHandler(async (req, res) => {
  const newProject = new Project({ ...req.body });
  const savedProject = await newProject.save();
  res.status(200).json(savedProject);
});

// @desc get project details by ID
// @route GET /api/projects/:id
exports.getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    'donationsId',
    'money'
  );

  // find total money donation of project
  const currentDonation = project.donationsId?.reduce((prev, item) => {
    return prev + item.money;
  }, 0);

  // change project "status" if current donation >= target donation
  if (currentDonation >= project.targetDonation) {
    project.status = 'Complete';
    project.remainTime = 0;
    await project.save();
  }

  if (project) {
    res.status(200).json({ project });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc update a project by ID
// @route PUT /api/projects/:id
exports.updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc delete a project by ID
// @route DELETE /api/projects/:id
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Project has been deleted' });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
});
