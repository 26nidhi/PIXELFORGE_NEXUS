import Document from "../models/Document.js";
import Project from "../models/Project.js";

// Upload Document (Admin & Lead)
export const uploadDocument = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Role check: Only Admin or Lead of that project
    if (req.user.role !== "Admin" && String(project.lead) !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to upload to this project" });
    }

    // File details
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const document = await Document.create({
      project: projectId,
      filename: file.originalname,
      filepath: file.path,
      uploadedBy: req.user.id,
    });

    res.status(201).json({ message: "Document uploaded", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Documents for Project (All team members)
export const getProjectDocuments = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId).populate("team", "_id");
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Ensure user is part of the project team
    const isTeamMember = project.team.some(
      (member) => String(member._id) === req.user.id
    );

    if (!isTeamMember && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const documents = await Document.find({ project: projectId }).populate(
      "uploadedBy",
      "name"
    );

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
