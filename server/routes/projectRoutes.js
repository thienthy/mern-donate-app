const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMIddleware');

// get all the projects
router.get('/projects', projectController.getProjects);

// get all the projects by admin
router.get(
  '/admin/projects',
  protect,
  admin,
  projectController.getAdminProjects
);

// add new project
router.post('/projects', protect, admin, projectController.addProject);

// get project details by ID
router.get('/projects/:id', projectController.getProjectById);

// update a project by ID
router.put('/projects/:id', protect, admin, projectController.updateProject);

// delete a project by ID
router.delete('/projects/:id', protect, admin, projectController.deleteProject);

module.exports = router;
