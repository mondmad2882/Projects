import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Assignment from "../models/Assignment.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";

export const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id }).populate({
      path: "userId",
      select: "email displayName role employeeId",
      populate: [
        {
          path: "role",
          select: "name permissions",
          populate: { path: "permissions", model: "Permission" },
        },
        {
          path: "employeeId"
        }
      ]
    });
    if (!employee) {
      // Fallback for System Admin who has no Employee record
      const user = await User.findById(req.user.id).populate({
        path: "role",
        select: "name permissions",
        populate: { path: "permissions", model: "Permission" },
      }).populate("employeeId");
      if (!user) {
        return res.status(404).json({ message: "User profile not found" });
      }
      return res.json({
        name: user.displayName || "System Admin",
        employeeId: null,
        department: "Administration",
        userId: user,
      });
    }
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "Role is required." });
    }

    // Check if user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    // Create User account
    const employeeRole = await Role.findById(roleId);
    if (!employeeRole) {
      return res.status(400).json({ message: "Role not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const hashedPassword = await bcrypt.hash("pass123", 10);

    const newUser = await User.create({
      displayName: name,
      email,
      role: employeeRole._id,
      password: hashedPassword,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Send setup email
    const resetUrl = `http://localhost:3000/forgot-password/${resetToken}`;
    const message = `
            <h1>Asset Management System</h1>
            <p>Welcome, ${name}! Your account has been created.</p>
            <p>Please click the link below to set your password:</p>
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Set Password</a>
            <p>This link will expire in 24 hours.</p>
        `;

    try {
      await sendEmail({
        email,
        subject: "Account Created - Asset Management System",
        html: message,
      });
      console.log(`Setup email sent to ${email}`);
    } catch (e) {
      console.error("Failed to send email:", e);
    }

    // Return the created user info matching standard structure
    res.status(201).json({
      _id: newUser._id,
      userId: {
        _id: newUser._id,
        email: newUser.email,
        displayName: newUser.displayName,
        role: employeeRole,
      },
      name: newUser.displayName,
      department: null,
      employeeId: null,
      assetsBorrowedCount: 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const { onlyEmployees } = req.query;
    if (onlyEmployees === "true") {
      const employees = await Employee.find().populate({
        path: "userId",
        populate: {
          path: "role",
          select: "name permissions",
        }
      });
      
      const shaped = employees.map(emp => {
        return {
          _id: emp.userId ? emp.userId._id : emp._id,
          userId: emp.userId,
          name: emp.userId?.displayName || emp.name,
          department: emp.department,
          employeeId: emp.employeeId,
        };
      });
      return res.json(shaped);
    }

    const users = await User.find({ isDeleted: false })
      .populate({
        path: "role",
        select: "name permissions",
      })
      .populate("employeeId")
      .populate("department");

    const employeesWithCount = await Promise.all(
      users.map(async (user) => {
        const emp = user.employeeId;
        
        const assetsBorrowedCount = await Assignment.countDocuments({
          employeeId: user._id,
          returnedDate: null,
        });

        return {
          _id: user._id,
          userId: {
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            employeeId: emp ? emp._id : null,
          },
          name: user.displayName,
          department: user.department?.department || null,
          employeeId: emp ? emp.employeeId : null,
          assetsBorrowedCount,
        };
      })
    );

    res.json(employeesWithCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("role")
      .populate("employeeId")
      .populate("department");
      
    if (!user) {
      // Fallback: check by Employee ID
      const emp = await Employee.findById(req.params.id).populate({
        path: "userId",
        populate: { path: "role" }
      });
      if (emp) {
        return res.json({
          _id: emp.userId?._id || emp._id,
          userId: emp.userId,
          name: emp.userId?.displayName || emp.name,
          department: emp.department,
          employeeId: emp.employeeId,
        });
      }
      return res.status(404).json({ message: "Employee not found" });
    }

    const emp = user.employeeId;
    return res.json({
      _id: user._id,
      userId: user,
      name: user.displayName,
      department: user.department?.department || null,
      employeeId: emp ? emp.employeeId : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id }).populate({
      path: "userId",
      select: "email displayName role employeeId",
      populate: [
        {
          path: "role",
          select: "name permissions",
          populate: { path: "permissions", model: "Permission" },
        },
        {
          path: "employeeId"
        }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let employee = null;

    if (user) {
      employee = await Employee.findOne({ userId: user._id, isDeleted: false });
    } else {
      employee = await Employee.findById(req.params.id);
      if (employee) {
        user = await User.findById(employee.userId);
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User/Employee not found" });
    }

    const userUpdate = {};
    if (req.body.name) {
      userUpdate.displayName = req.body.name;
    }
    if (req.body.email) {
      const targetEmail = req.body.email.trim().toLowerCase();
      if (user.email !== targetEmail) {
        const emailExists = await User.findOne({ email: targetEmail, _id: { $ne: user._id }, isDeleted: false });
        if (emailExists) {
          return res.status(400).json({ message: "A user with this email already exists." });
        }
        userUpdate.email = targetEmail;

        // Generate password setup token and send email
        const resetToken = crypto.randomBytes(20).toString("hex");
        const hashedToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
        userUpdate.resetPasswordToken = hashedToken;
        userUpdate.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;

        const name = req.body.name || user.displayName;
        const resetUrl = `http://localhost:3000/forgot-password/${resetToken}`;
        const mailMessage = `
            <h1>Asset Management System</h1>
            <p>Hello ${name},</p>
            <p>Your email address has been updated to ${targetEmail}.</p>
            <p>Please click the link below to set your password and access your account:</p>
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Set Password</a>
            <p>This link will expire in 24 hours.</p>
        `;

        try {
          await sendEmail({
            email: targetEmail,
            subject: "Email Updated - Asset Management System",
            html: mailMessage,
          });
          console.log(`Setup email sent to updated email: ${targetEmail}`);
        } catch (e) {
          console.error("Failed to send email to updated address:", e);
        }
      }
    }
    if (req.body.roleId) {
      userUpdate.role = req.body.roleId;
    }

    if (employee) {
      if (req.body.name) employee.name = req.body.name;
      if (req.body.department) employee.department = req.body.department;

      if (req.body.employeeId) {
        let formattedEmployeeId = String(req.body.employeeId).trim();
        if (/^\d{1,4}$/.test(formattedEmployeeId)) {
          formattedEmployeeId = formattedEmployeeId.padStart(4, "0");
        }
        if (!/^\d{4}$/.test(formattedEmployeeId)) {
          return res.status(400).json({ message: "Employee ID must be a number up to 4 digits." });
        }
        const empIdExists = await Employee.findOne({ employeeId: formattedEmployeeId, _id: { $ne: employee._id }, isDeleted: false });
        if (empIdExists) {
          return res.status(400).json({ message: "An employee with this ID already exists." });
        }
        employee.employeeId = formattedEmployeeId;
      }
      await employee.save();
      if (!user.employeeId || user.employeeId.toString() !== employee._id.toString() || !user.department || user.department.toString() !== employee._id.toString()) {
        userUpdate.employeeId = employee._id;
        userUpdate.department = employee._id;
      }
    } else if (req.body.employeeId || req.body.department) {
      let formattedEmployeeId = String(req.body.employeeId || "").trim();
      if (/^\d{1,4}$/.test(formattedEmployeeId)) {
        formattedEmployeeId = formattedEmployeeId.padStart(4, "0");
      }
      if (!/^\d{4}$/.test(formattedEmployeeId)) {
        return res.status(400).json({ message: "Employee ID must be a number up to 4 digits." });
      }
      const empIdExists = await Employee.findOne({ employeeId: formattedEmployeeId, isDeleted: false });
      if (empIdExists) {
        return res.status(400).json({ message: "An employee with this ID already exists." });
      }
      employee = await Employee.create({
        name: req.body.name || user.displayName,
        department: req.body.department || "General",
        employeeId: formattedEmployeeId,
        userId: user._id,
        createdBy: req.user.id,
      });
      userUpdate.employeeId = employee._id;
      userUpdate.department = employee._id;
    }

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(user._id, userUpdate, { runValidators: true });
    }

    const updatedUser = await User.findById(user._id)
      .populate({
        path: "role",
        select: "name",
      })
      .populate("employeeId")
      .populate("department");

    const empObj = updatedUser.employeeId;
    let assetsBorrowedCount = 0;
    if (empObj) {
      assetsBorrowedCount = await Assignment.countDocuments({
        employeeId: updatedUser._id,
        returnedDate: null,
      });
    }

    res.json({
      _id: updatedUser._id,
      userId: {
        _id: updatedUser._id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        role: updatedUser.role,
        employeeId: empObj ? empObj._id : null,
      },
      name: updatedUser.displayName,
      department: updatedUser.department?.department || null,
      employeeId: empObj ? empObj.employeeId : null,
      assetsBorrowedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let employee = null;

    if (user) {
      employee = await Employee.findOne({ userId: user._id, isDeleted: false });
    } else {
      employee = await Employee.findById(req.params.id);
      if (employee) {
        user = await User.findById(employee.userId);
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User/Employee not found" });
    }

    if (user.email === "admin@test.com") {
      return res
        .status(400)
        .json({ message: "Seeded admin account cannot be deleted." });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user.id;
    await user.save();

    if (employee) {
      employee.isDeleted = true;
      employee.deletedAt = new Date();
      employee.deletedBy = req.user.id;
      await employee.save();
    }

    res.json({ message: "User account removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userUpdate = {};
    if (req.body.name) userUpdate.displayName = req.body.name;
    if (req.body.email) {
      const emailExists = await User.findOne({ 
        email: req.body.email.trim().toLowerCase(), 
        _id: { $ne: req.user.id }, 
        isDeleted: false 
      });
      if (emailExists) {
        return res.status(400).json({ message: "An employee with this email already exists." });
      }
      userUpdate.email = req.body.email.trim().toLowerCase();
    }

    if (req.body.password) {
      const saltRounds = 10;
      userUpdate.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(req.user.id, userUpdate, { runValidators: true });
    }

    const employee = await Employee.findOne({ userId: req.user.id });
    if (employee) {
      employee.name = req.body.name || employee.name;
      employee.department = req.body.department || employee.department;
      await employee.save();

      const populated = await Employee.findById(employee._id).populate({
        path: "userId",
        select: "email displayName role",
        populate: { path: "role", select: "name" },
      });
      return res.json(populated);
    } else {
      // Return System Admin mock employee profile
      const user = await User.findById(req.user.id).populate({
        path: "role",
        select: "name permissions",
      });
      return res.json({
        name: user.displayName || "System Admin",
        employeeId: null,
        department: "Administration",
        userId: user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
