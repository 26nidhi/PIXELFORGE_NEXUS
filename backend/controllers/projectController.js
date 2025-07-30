import Project from "../models/Project.js";
import User from "../models/User.js";

// Create Project (Admin only)
export const createProject = async (req, res) => {
  try {
    const { name, description, deadline, leadId } = req.body;

    const lead = await User.findById(leadId);
    if (!lead || lead.role !== "Project Lead") {
      return res.status(400).json({ message: "Invalid project lead" });
    }

    const project = await Project.create({
      name,
      description,
      deadline,
      lead: lead._id,
      team: [lead._id], // Lead is part of team by default
    });

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Projects (Admin)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("lead", "name email")
      .populate("team", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Project Completed (Admin)
export const markProjectCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = "Completed";
    await project.save();

    res.json({ message: "Project marked as completed", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Project (Admin)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign Developers to Project (Project Lead)
export const assignDevelopers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { developerIds } = req.body; // Array of developer IDs

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only the project lead can assign developers
    if (String(project.lead) !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to assign developers" });
    }

    // Validate developers
    const developers = await User.find({
      _id: { $in: developerIds },
      role: "Developer",
    });
    const validDeveloperIds = developers.map((dev) => dev._id);

    // Add unique developers to team
    project.team = [...new Set([...project.team, ...validDeveloperIds])];
    await project.save();

    res.json({ message: "Developers assigned", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Projects for Current User (Lead/Developer)
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ team: userId })
      .populate("lead", "name")
      .populate("team", "name");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
