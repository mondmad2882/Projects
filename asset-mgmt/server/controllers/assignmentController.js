import Assignment from "../models/Assignment.js";
import Asset from "../models/Asset.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const assignAsset = async (req, res) => {
  try {
    const { assetId, employeeId, tentativeReturnDate } = req.body;
    if (tentativeReturnDate) {
      const dateVal = new Date(tentativeReturnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateVal < today) {
        return res
          .status(400)
          .json({ message: "Return date cannot be in the past" });
      }
    }

    // Check if asset and user exist
    const asset = await Asset.findById(assetId);
    const user = await User.findById(employeeId).populate("role");
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Restrict assignment to users with admin roles
    if (user.role && user.role.name.toLowerCase() === "admin") {
      return res.status(400).json({ message: "Assets cannot be assigned to users with Admin roles." });
    }

    // Check if asset is already assigned
    if (asset.status !== "available") {
      return res
        .status(400)
        .json({ message: "Asset is not available for assignment" });
    }
    const assignment = await Assignment.create({
      assetId,
      employeeId: user._id,
      assignedDate: new Date(),
      tentativeReturnDate: tentativeReturnDate
        ? new Date(tentativeReturnDate)
        : null,
      createdBy: req.user.id,
    });
    asset.status = "assigned";
    await asset.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const returnAsset = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    if (assignment.returnedDate) {
      return res.status(400).json({ message: "Asset is already returned" });
    }
    assignment.returnedDate = new Date();
    await assignment.save();
    // Update asset status back to available
    const asset = await Asset.findById(assignment.assetId);
    if (asset) {
      asset.status = "available";
      await asset.save();
    }
    res.json({ message: "Asset returned successfully", assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({})
      .populate("assetId", "name type assetId status")
      .populate({
        path: "employeeId",
        populate: [
          { path: "employeeId" },
          { path: "department" }
        ]
      })
      .populate({
        path: "createdBy",
        populate: { path: "employeeId" }
      })
      .sort({ createdAt: -1 })
      .lean();

    const shapedAssignments = assignments.map(a => {
      const emp = a.employeeId || {};
      const creator = a.createdBy || {};
      return {
        ...a,
        employeeId: {
          _id: emp._id || null,
          name: emp.displayName || "",
          employeeId: emp.employeeId?.employeeId || null,
          department: emp.department?.department || null
        },
        createdBy: {
          _id: creator._id || null,
          displayName: creator.displayName || ""
        },
        assignerEmployee: creator.employeeId ? {
          name: creator.employeeId.name,
          employeeId: creator.employeeId.employeeId,
          department: creator.employeeId.department
        } : null
      };
    });

    res.json(shapedAssignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ employeeId: req.user.id })
      .populate("assetId", "name type assetId status")
      .populate({
        path: "employeeId",
        populate: [
          { path: "employeeId" },
          { path: "department" }
        ]
      })
      .populate({
        path: "createdBy",
        populate: { path: "employeeId" }
      })
      .sort({ createdAt: -1 })
      .lean();

    const shapedAssignments = assignments.map(a => {
      const emp = a.employeeId || {};
      const creator = a.createdBy || {};
      return {
        ...a,
        employeeId: {
          _id: emp._id || null,
          name: emp.displayName || "",
          employeeId: emp.employeeId?.employeeId || null,
          department: emp.department?.department || null
        },
        createdBy: {
          _id: creator._id || null,
          displayName: creator.displayName || ""
        },
        assignerEmployee: creator.employeeId ? {
          name: creator.employeeId.name,
          employeeId: creator.employeeId.employeeId,
          department: creator.employeeId.department
        } : null
      };
    });

    res.json(shapedAssignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const borrowAsset = async (req, res) => {
  try {
    const { assetId, tentativeReturnDate } = req.body;

    if (tentativeReturnDate) {
      const dateVal = new Date(tentativeReturnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateVal < today) {
        return res
          .status(400)
          .json({ message: "Return date cannot be in the past" });
      }
    }

    const user = await User.findById(req.user.id).populate("role");
    if (user && user.role && user.role.name.toLowerCase() === "admin") {
      return res.status(403).json({ message: "Users with Admin roles cannot borrow assets." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (asset.status !== "available") {
      return res
        .status(400)
        .json({ message: "Asset is not available for borrowing" });
    }

    const assignment = await Assignment.create({
      assetId,
      employeeId: user._id,
      assignedDate: new Date(),
      tentativeReturnDate: tentativeReturnDate
        ? new Date(tentativeReturnDate)
        : null,
      createdBy: req.user.id,
    });

    asset.status = "assigned";
    await asset.save();

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
